from flask import Flask, request
import os
import requests
from groq import Groq

app = Flask(__name__)

VERIFY_TOKEN = "apnabot_verify_123"
IG_TOKEN = os.environ.get("INSTAGRAM_ACCESS_TOKEN") or os.environ.get("INSTAGRAM_ACC_TOKEN") or os.environ.get("IG_TOKEN")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

def get_ai_reply(user_msg):
    if not client:
        return "Haan bhai bolo, cutting karwani hai ya shave? Price 100rs se start hai."
    try:
        chat = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a barber shop AI assistant for 'baby_bawaal_' barber. Reply in Hinglish mix, short, friendly. Take appointments."},
                {"role": "user", "content": user_msg}
            ],
            model="llama3-8b-8192",
        )
        return chat.choices[0].message.content
    except Exception as e:
        print(f"Groq Error: {e}")
        return "Bolo bhai kya karwana hai?"

def send_comment_reply(comment_id, message_text):
    if not IG_TOKEN:
        print("IG_TOKEN missing!")
        return
    url = f"https://graph.instagram.com/v21.0/{comment_id}/replies"
    payload = {
        "message": message_text,
        "access_token": IG_TOKEN
    }
    r = requests.post(url, data=payload)
    print(f"Comment Reply Sent: {r.status_code} {r.text}")

def send_dm_reply(sender_id, message_text):
    if not IG_TOKEN:
        return
    url = f"https://graph.instagram.com/v21.0/me/messages"
    payload = {
        "recipient": {"id": sender_id},
        "message": {"text": message_text},
        "access_token": IG_TOKEN
    }
    r = requests.post(url, json=payload)
    print(f"DM Reply Sent: {r.status_code} {r.text}")

@app.route('/')
def home():
    return "Barber AI Assistant is Running - WhatsApp & Instagram Ready"

@app.route('/webhook/instagram', methods=['GET'])
def verify_webhook():
    mode = request.args.get('hub.mode') or request.args.get('hub_mode')
    token = request.args.get('hub.verify_token') or request.args.get('hub_verify_token')
    challenge = request.args.get('hub.challenge') or request.args.get('hub_challenge')
    if mode == 'subscribe' and token == VERIFY_TOKEN:
        print("WEBHOOK VERIFIED!")
        return challenge, 200
    return 'Verification Failed', 403

@app.route('/webhook/instagram', methods=['POST'])
def receive_instagram():
    data = request.json
    print("Webhook Aaya:", data)

    if not data:
        return 'OK', 200

    # --- 1. COMMENTS HANDLING ---
    try:
        for entry in data.get('entry', []):
            for change in entry.get('changes', []):
                if change.get('field') == 'comments':
                    value = change.get('value', {})
                    comment_id = value.get('id')
                    comment_text = value.get('text', '')
                    username = value.get('from', {}).get('username', 'bhai')

                    # Khud ke comment pe reply mat kar
                    if comment_id and comment_text:
                        print(f"Comment Aaya: {comment_text} from {username}")
                        ai_reply = get_ai_reply(f"Instagram comment from {username}: {comment_text}")
                        send_comment_reply(comment_id, ai_reply)
    except Exception as e:
        print(f"Comment handle error: {e}")

    # --- 2. DM HANDLING ---
    try:
        for entry in data.get('entry', []):
            for msg in entry.get('messaging', []):
                # message_edit ko ignore kar, sirf real message
                if 'message' in msg and 'text' in msg['message']:
                    sender_id = msg['sender']['id']
                    text = msg['message']['text']
                    print(f"DM Aaya: {text}")
                    ai_reply = get_ai_reply(text)
                    send_dm_reply(sender_id, ai_reply)
    except Exception as e:
        print(f"DM handle error: {e}")

    return 'OK', 200

@app.route('/webhook/whatsapp', methods=['GET', 'POST'])
def whatsapp_webhook():
    if request.method == 'GET':
        if request.args.get('hub.verify_token') == VERIFY_TOKEN or request.args.get('hub_verify_token') == VERIFY_TOKEN:
            return request.args.get('hub.challenge') or request.args.get('hub_challenge')
        return 'Failed', 403
    else:
        print("WhatsApp Message:", request.json)
        return 'OK', 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
