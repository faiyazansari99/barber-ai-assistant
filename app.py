from flask import Flask, request
import requests, os

app = Flask(__name__)

VERIFY_TOKEN = os.getenv("VERIFY_TOKEN", "faiyaz123")
IG_TOKEN = os.getenv("IG_ACCESS_TOKEN") # yahi tera long lived token
IG_ID = os.getenv("IG_USER_ID") # baby_bawaal_ ka IG user ID

@app.route("/")
def home():
    return "Bot is live"

@app.route("/webhook/instagram", methods=["GET"])
def verify():
    if request.args.get("hub.verify_token") == VERIFY_TOKEN:
        return request.args.get("hub.challenge")
    return "Failed", 403

@app.route("/webhook/instagram", methods=["POST"])
def webhook():
    data = request.get_json()
    print(f"Webhook: {data}")
    try:
        # message nikalo
        entry = data['entry'][0]['changes'][0]['value']
        if 'message' in entry:
            sender_id = entry['sender']['id']
            text = entry['message']['text'].lower()

            if "price" in text:
                reply = "Haircut 199₹, Beard 99₹, Combo 249₹. Location: MG Road. Booking karu?"
            elif "location" in text or "kaha" in text:
                reply = "MG Road, Near City Mall, Nagpur. Map: https://..."
            else:
                reply = "Hi! Baby Bawaal me swagat hai. Price, Location ya Booking - kya chahiye?"

            # reply bhejo
            url = f"https://graph.facebook.com/v20.0/{IG_ID}/messages"
            payload = {"recipient": {"id": sender_id}, "message": {"text": reply}}
            headers = {"Authorization": f"Bearer {IG_TOKEN}"}
            r = requests.post(url, json=payload, headers=headers)
            print(f"Reply sent: {r.text}")
    except Exception as e:
        print(f"Error: {e}")

    return "ok", 200

if __name__ == "__main__":
    app.run()
