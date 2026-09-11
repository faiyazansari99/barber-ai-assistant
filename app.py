from flask import Flask, request
import os
from groq import Groq

app = Flask(__name__)

# --- CONFIG ---
VERIFY_TOKEN = "apnabot_verify_123"
GROQ_API_KEY = os.environ.get("GROQ_API_KEY") # Render me daalna padega

client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

def get_ai_reply(user_msg):
    if not client:
        return "Haan bhai, bolo kya kaam hai? Cutting, shave?"
    try:
        chat = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a barber shop AI assistant. Reply in Hindi/English mix. Take appointments, answer price."},
                {"role": "user", "content": user_msg}
            ],
            model="llama3-8b-8192",
        )
        return chat.choices[0].message.content
    except Exception as e:
        print(e)
        return "Bolo bhai kya karwana hai?"

# --- HOME ---
@app.route('/')
def home():
    return "Barber AI Assistant is Running - WhatsApp & Instagram Ready"

# --- INSTAGRAM & FACEBOOK WEBHOOK (YEHI TERA SERVER.JS WALA CODE HAI) ---
@app.route('/webhook/instagram', methods=['GET'])
def verify_webhook():
    mode = request.args.get('hub.mode')
    token = request.args.get('hub.verify_token')
    challenge = request.args.get('hub.challenge')
    if mode == 'subscribe' and token == VERIFY_TOKEN:
        print("WEBHOOK VERIFIED!")
        return challenge, 200
    return 'Verification Failed', 403

@app.route('/webhook/instagram', methods=['POST'])
def receive_instagram():
    data = request.json
    print("Insta Message Aaya:", data)
    # Yaha se tu message nikal ke auto-reply bhej sakta hai
    # Logic same rahega
    return 'OK', 200

# --- WHATSAPP WEBHOOK (Agar same use karna hai to) ---
@app.route('/webhook/whatsapp', methods=['GET', 'POST'])
def whatsapp_webhook():
    if request.method == 'GET':
        if request.args.get('hub.verify_token') == VERIFY_TOKEN:
            return request.args.get('hub.challenge')
        return 'Failed', 403
    else:
        print("WhatsApp Message:", request.json)
        return 'OK', 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
