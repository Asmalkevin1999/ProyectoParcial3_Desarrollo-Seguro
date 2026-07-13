import joblib
import re

from scipy.sparse import hstack
from scipy.sparse import csr_matrix


saved = joblib.load(
    "models/model.joblib"
)

model = saved["model"]
tfidf = saved["tfidf"]


# ==========================================
# FUNCIONES PELIGROSAS
# ==========================================

DANGEROUS = [

    # C
    "gets",
    "strcpy",
    "strcat",
    "system",
    "scanf",
    "sprintf",

    # Python
    "os.system",
    "subprocess.popen",
    "eval",
    "exec",

    # TypeScript / JavaScript
    "eval(",
    "function(",
    "new function",
    "settimeout(",
    "setinterval(",
    "document.write",
    "innerhtml",
    "outerhtml",

    # NodeJS
    "child_process.exec",
    "child_process.execsync",
    "exec(",
    "execsync(",
    "spawn(",
    "spawnsync(",
    "fork(",

    # SQL Injection
    "query(`",
    "query(\"",
    "query('",

    # File System
    "fs.readfilesync",
    "fs.writefilesync",
    "fs.unlink",

    # JWT inseguro
    "jwt.decode",

    # Crypto
    "md5",
    "sha1"
]


# ==========================================
# FUNCIONES SEGURAS
# ==========================================

SANITIZERS = [

    "snprintf",
    "strncpy",
    "strncat",
    "fgets",
    "escape",
    "sanitize",

    # Angular
    "dompurify.sanitize",
    "sanitizer",

    # NestJS
    "validationpipe",
    "class-validator",
    "class-transformer",

    # Seguridad
    "bcrypt.hash",
    "bcrypt.compare",
    "jsonwebtoken.verify",

    # Prisma
    "prisma.",

    # Parseo
    "parseint",
    "parsefloat",

    # Encode
    "encodeuricomponent",
    "decodeuricomponent"
]


# ==========================================
# FEATURES MANUALES
# ==========================================

def extract_manual_features(code):

    code = str(code).lower()

    dangerous_count = sum(
        code.count(x)
        for x in DANGEROUS
    )

    sanitizer_count = sum(
        code.count(x)
        for x in SANITIZERS
    )

    code_length = len(code)

    line_count = len(
        code.splitlines()
    )

    return [
        dangerous_count,
        sanitizer_count,
        code_length,
        line_count
    ]


# ==========================================
# DESCRIPCIÓN DE LA VULNERABILIDAD
# ==========================================

def detect_vulnerability_reason(code):

    code = str(code).lower()

    if "eval(" in code:

        return {
            "vulnerability": "Code Injection",
            "reason": "Uso de eval().",
            "recommendation": "Evitar eval()."
        }

    if "exec(" in code:

        return {
            "vulnerability": "Command Injection",
            "reason": "Uso de exec().",
            "recommendation": "Evitar exec()."
        }

    if "child_process.exec" in code:

        return {
            "vulnerability": "Command Injection",
            "reason": "Uso de child_process.exec().",
            "recommendation": "Validar entradas."
        }

    if "execsync(" in code:

        return {
            "vulnerability": "Command Injection",
            "reason": "Uso de execSync().",
            "recommendation": "Validar entradas."
        }

    if "new function" in code:

        return {
            "vulnerability": "Code Injection",
            "reason": "Uso de new Function().",
            "recommendation": "Evitar código dinámico."
        }

    if "document.write" in code:

        return {
            "vulnerability": "XSS",
            "reason": "Uso de document.write().",
            "recommendation": "Sanitizar entradas."
        }

    if "innerhtml" in code:

        return {
            "vulnerability": "XSS",
            "reason": "Uso de innerHTML.",
            "recommendation": "Usar DOMPurify."
        }

    if "query(`" in code:

        return {
            "vulnerability": "SQL Injection",
            "reason": "Concatenación de SQL.",
            "recommendation": "Usar Prisma."
        }

    if "jwt.decode" in code:

        return {
            "vulnerability": "JWT Insecure",
            "reason": "Uso de jwt.decode().",
            "recommendation": "Usar jwt.verify()."
        }

    if "fs.unlink" in code:

        return {
            "vulnerability": "File Manipulation",
            "reason": "Eliminación de archivos.",
            "recommendation": "Validar rutas."
        }

    return {
        "vulnerability": "Posible vulnerabilidad",
        "reason": "Detectada por el modelo ML.",
        "recommendation": "Revisar manualmente."
    }


# ==========================================
# PREDICCIÓN
# ==========================================

def predict_code(code):

    code_lower = str(code).lower()

    # ==========================
    # REGLAS DIRECTAS
    # ==========================

    dangerous_patterns = [

        r"\beval\s*\(",
        r"\bexec\s*\(",
        r"child_process\.exec",
        r"child_process\.execsync",
        r"\bexecsync\s*\(",
        r"\bspawn\s*\(",
        r"\bspawnsync\s*\(",
        r"\bfork\s*\(",
        r"document\.write",
        r"innerhtml",
        r"new function",
        r"jwt\.decode",
        r"fs\.unlink",
        r"os\.system",
        r"subprocess\.popen",
        r"\bgets\s*\(",
        r"\bstrcpy\s*\(",
        r"\bstrcat\s*\(",
        r"\bsprintf\s*\(",
        r"\bsystem\s*\("
    ]

    for pattern in dangerous_patterns:

        if re.search(pattern, code_lower):

            info = detect_vulnerability_reason(
                code
            )

            return {
                "result": "VULNERABLE",
                "confidence": 99.0,
                "vulnerability": info["vulnerability"],
                "reason": info["reason"],
                "recommendation": info["recommendation"]
            }

    # ==========================
    # CÓDIGO SEGURO
    # ==========================

    safe_patterns = [

        "validationpipe",
        "class-validator",
        "bcrypt.hash",
        "bcrypt.compare",
        "dompurify.sanitize",
        "fgets(",
        "strncpy(",
        "snprintf(",
        "prisma.",
        "parseint(",
        "parsefloat("
    ]

    for pattern in safe_patterns:

        if pattern in code_lower:

            return {
                "result": "SAFE",
                "confidence": 95.0
            }

    # ==========================
    # MODELO ML
    # ==========================

    tfidf_features = tfidf.transform(
        [code]
    )

    manual_features = csr_matrix([

        extract_manual_features(
            code
        )

    ])

    X = hstack([
        tfidf_features,
        manual_features
    ])

    pred = model.predict(X)[0]

    probs = model.predict_proba(X)[0]

    confidence = round(
        float(max(probs)) * 100,
        2
    )

    if pred == 1:

        info = detect_vulnerability_reason(
            code
        )

        return {
            "result": "VULNERABLE",
            "confidence": confidence,
            "vulnerability": info["vulnerability"],
            "reason": info["reason"],
            "recommendation": info["recommendation"]
        }

    return {
        "result": "SAFE",
        "confidence": confidence
    }