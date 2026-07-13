import sys
import os

sys.path.append(
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "..",
            ".."
        )
    )
)

from src.ml.predict import predict_code
from src.ml.scan_project import scan_project
from src.notifications.telegram_bot import send_message


send_message(
    "🔍 Inicio de revisión de seguridad"
)


if len(sys.argv) < 2:

    print(
        "Debe indicar archivo o directorio"
    )

    send_message(
        "❌ Error: no se indicó ruta"
    )

    sys.exit(1)


target = sys.argv[1]


# ==========================================
# ANALIZAR DIRECTORIO COMPLETO
# ==========================================

if os.path.isdir(target):

    print(
        f"Analizando proyecto: {target}"
    )

    report = scan_project(target)

    if len(report) > 0:

        message = (
            "🚨 Vulnerabilidades detectadas\n\n"
        )

        for item in report:

            message += (
                f"Archivo: {item['file']}\n"
                f"Vulnerabilidad: "
                f"{item.get('vulnerability')}\n"
                f"Confianza: "
                f"{item.get('confidence')}%\n\n"
            )

        send_message(message)

        print(message)

        sys.exit(1)

    send_message(
        f"""
✅ Proyecto seguro

Ruta:
{target}

No se encontraron vulnerabilidades.
"""
    )

    print("Proyecto seguro")

    sys.exit(0)


# ==========================================
# VALIDAR ARCHIVO
# ==========================================

allowed_extensions = (
    ".py",
    ".c",
    ".cpp",
    ".ts",
    ".js",
    ".tsx",
    ".jsx"
)

if not target.endswith(
    allowed_extensions
):

    print(
        f"Archivo ignorado: {target}"
    )

    sys.exit(0)


if not os.path.exists(target):

    print(
        f"Archivo no encontrado: {target}"
    )

    sys.exit(1)


# ==========================================
# LEER ARCHIVO
# ==========================================

with open(
    target,
    "r",
    encoding="utf-8",
    errors="ignore"
) as f:

    code = f.read()


# ==========================================
# EJECUTAR MODELO
# ==========================================

result = predict_code(code)

print(result)


# ==========================================
# VULNERABILIDAD
# ==========================================

if result["result"] == "VULNERABLE":

    send_message(
        f"""
❌ Vulnerabilidad detectada

Archivo:
{target}

Resultado:
VULNERABLE

Confianza:
{result['confidence']}%

Vulnerabilidad:
{result.get('vulnerability')}

Motivo:
{result.get('reason')}

Recomendación:
{result.get('recommendation')}

PR bloqueado.
"""
    )

    print(
        "Vulnerabilidad detectada"
    )

    sys.exit(1)


# ==========================================
# SEGURO
# ==========================================

send_message(
    f"""
✅ Código seguro

Archivo:
{target}

Resultado:
SAFE

Confianza:
{result['confidence']}%

Continuando pipeline.
"""
)

print(
    "Código seguro"
)

sys.exit(0)