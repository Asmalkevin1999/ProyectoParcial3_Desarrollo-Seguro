import os
import requests

from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("TELEGRAM_TOKEN") or os.getenv("BOT_TOKEN")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID") or os.getenv("CHAT_ID")


def send_message(message: str):
    if not TOKEN or not CHAT_ID:
        return None

    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    response = requests.post(
        url,
        json={
            "chat_id": CHAT_ID,
            "text": message,
            "parse_mode": "HTML",
        },
        timeout=10,
    )
    return response


def notify_event(title: str, detail: str = ""):
    text = f"<b>{title}</b>"
    if detail:
        text += f"\n{detail}"
    return send_message(text)