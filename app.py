from flask import Flask, request, jsonify
import os
from groq import Groq

app = Flask(__name__)
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# --- SHOP DETAILS - Yahi badalna hai har client ke liye ---
SHOP_INFO = """
Shop Name: New York Fadez
Location: Queens, New York
Price: Haircut $25, Beard Trim $15, Combo $35
Timing: 9AM to 9PM, Open 7 days
Booking Link: https://your-booking-link.com
Owner: Aslam Bhai
"""

SYSTEM_PROMPT = f"""
You are a staff member at {SHOP_INFO}. 
Your job is to talk like a real human, professional and friendly, in perfect US English.

RULES:
1. NEVER say you are a bot, AI, assistant. You are a human staff member.
2. Answer only about barber shop - price, timing, location, booking.
3. If user asks anything else (politics, cricket, etc), politely say: "I don't have info on that, but I can help you with a haircut or beard trim. Would you like to book an appointment?"
4. Always be short, professional, human-like. Use bro, sure thing, got you - but professional.
5. Always push for booking at the end.

Shop Details: {SHOP_INFO}
"""

@app.route("/", methods=["GET"])
def home():
    return "Barber AI Assistant is Running 24/7"

@app.route("/webhook", methods=["POST"])
def webhook():
    data = request.json
    user_msg = data.get("message", "")
    
    chat = client.chat.completions.create(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_msg}
        ],
        model="llama3-8b-8192",
    )
    reply = chat.choices[0].message.content
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
