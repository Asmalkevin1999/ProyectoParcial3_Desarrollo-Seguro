import os

from src.ml.predict import predict_code


def scan_project(path):

    report = []

    for root, dirs, files in os.walk(path):

        for file in files:

            if file.endswith(
                (
                    ".ts",
                    ".js",
                    ".tsx",
                    ".jsx"
                )
            ):

                file_path = os.path.join(
                    root,
                    file
                )

                with open(
                    file_path,
                    "r",
                    encoding="utf-8",
                    errors="ignore"
                ) as f:

                    code = f.read()

                result = predict_code(
                    code
                )

                if (
                    result["result"]
                    == "VULNERABLE"
                ):

                    report.append({

                        "file": file_path,
                        **result

                    })

    return report