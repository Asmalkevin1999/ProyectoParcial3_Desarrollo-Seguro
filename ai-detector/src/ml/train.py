import pandas as pd
import joblib

from scipy.sparse import hstack
from scipy.sparse import csr_matrix

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.metrics import classification_report


# ============================
# FUNCIONES PELIGROSAS
# ============================

DANGEROUS = [

    # C / C++
    "gets",
    "strcpy",
    "strcat",
    "system",
    "scanf",
    "sprintf",

    # Python
    "os.system",
    "subprocess.popen",
    "pickle.loads",
    "eval",
    "exec",

    # JavaScript / TypeScript
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

    # NoSQL Injection
    "$where",

    # File System
    "fs.readfilesync",
    "fs.writefilesync",
    "fs.unlink",

    # JWT inseguro
    "jwt.decode",

    # Crypto inseguro
    "md5",
    "sha1"
]


# ============================
# FUNCIONES SEGURAS
# ============================

SANITIZERS = [

    # C
    "snprintf",
    "strncpy",
    "fgets",
    "strncat",

    # Generales
    "escape",
    "sanitize",

    # Angular
    "dompurify.sanitize",
    "sanitizer",
    "bypasssecuritytrust",

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


# ============================
# FEATURES MANUALES
# ============================

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


print("Cargando dataset...")

df = pd.read_csv(
    "data/juliet_balanced.csv"
)


# ============================
# EJEMPLOS EXTRA
# ============================

extra_examples = pd.DataFrame({

    "code": [

        # -----------------
        # C seguros
        # -----------------

        """
char buffer[50];
fgets(buffer,sizeof(buffer),stdin);
""",

        """
char destino[50];
strncpy(destino,origen,sizeof(destino));
""",

        """
snprintf(buffer,sizeof(buffer),"%s",cadena);
""",

        # -----------------
        # Python seguros
        # -----------------

        """
def suma(a,b):
    return a+b
""",

        """
class Persona:
    def __init__(self,nombre):
        self.nombre = nombre
""",

        # -----------------
        # TS seguros
        # -----------------

        """
const users = await prisma.user.findMany();
""",

        """
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {}
""",

        """
ValidationPipe
""",

        """
bcrypt.hash(password,10)
""",

        """
DOMPurify.sanitize(html)
""",

        """
parseInt(id)
""",

        # -----------------
        # C vulnerables
        # -----------------

        """
gets(buffer);
""",

        """
strcpy(destino,origen);
""",

        """
strcat(destino,origen);
""",

        """
sprintf(buffer,"%s",cadena);
""",

        """
system(cmd);
""",

        # -----------------
        # Python vulnerables
        # -----------------

        """
import os
os.system(cmd)
""",

        """
eval(user_input)
""",

        """
exec(code)
""",

        """
import subprocess
subprocess.Popen(cmd)
""",

        # -----------------
        # TS vulnerables
        # -----------------

        """
eval(req.body.code)
""",

        """
child_process.exec(cmd)
""",

        """
execSync(command)
""",

        """
document.body.innerHTML = req.body.html
""",

        """
setTimeout(userInput)
""",

        """
query(`SELECT * FROM users WHERE id=${id}`)
""",

        """
fs.unlink(file)
""",

        """
new Function(userCode)
""",

        """
jwt.decode(token)
""",

        """
const html = req.body.html;
document.write(html);
"""
    ],

    "label": [

        # seguros
        0, 0, 0,
        0, 0,
        0, 0, 0, 0, 0, 0,

        # vulnerables
        1, 1, 1, 1, 1,
        1, 1, 1, 1,
        1, 1, 1, 1, 1,
        1, 1, 1, 1, 1
    ]

})


df = pd.concat(
    [df, extra_examples],
    ignore_index=True
)


X_text = df["code"]
y = df["label"]


print("Extrayendo features manuales...")

manual_features = [

    extract_manual_features(code)

    for code in X_text

]

manual_features = csr_matrix(
    manual_features
)


print("Generando TF-IDF...")

tfidf = TfidfVectorizer(

    max_features=10000,
    ngram_range=(1, 2)

)

X_tfidf = tfidf.fit_transform(
    X_text
)


X = hstack([
    X_tfidf,
    manual_features
])


print("Dividiendo dataset...")

X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y

)


print("Entrenando Logistic Regression...")

model = LogisticRegression(

    max_iter=3000,
    random_state=42

)

model.fit(
    X_train,
    y_train
)


preds = model.predict(
    X_test
)


acc = accuracy_score(
    y_test,
    preds
)


print("\n========================")
print(f"Accuracy: {acc:.4f}")
print("========================\n")


print(

    classification_report(
        y_test,
        preds
    )

)


# ============================
# GUARDAR MODELO
# ============================

joblib.dump(

    {
        "model": model,
        "tfidf": tfidf
    },

    "models/model.joblib"

)

print("✅ Modelo guardado.")