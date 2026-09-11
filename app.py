from flask import Flask, request
import os, requests
from groq import Groq

app = Flask(__name__)
VERIFY_TOKEN = "apnabot_verify_123"
IG_TOKEN = os.environ.get("INSTAGRAM_ACCESS_TOKEN") or os.environ.get("IG_TOKEN")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

def get_ai_reply(msg):
    if not client: return "Haan bhai bolo, cutting karwani hai? Price 100rs se start."
    try:
        c = client.chat.completions.create(model="llama3-8b-8192", messages=[{"role":"system","content":"You are barber AI for baby_bawaal_, reply in short Hinglish, friendly."},{"role":"user","content":msg}])
        return c.choices[0].message.content
    except: return "Bolo bhai kya karwana hai?"

def send_comment_reply(cid, text):
    if not IG_TOKEN: return
    r = requests.post(f"https://graph.facebook.com/v21.0/{cid}/replies", data={"message":text,"access_token":IG_TOKEN})
    print(f"Reply Status: {r.status_code} {r.text}")

def send_dm_reply(sid, text):
    if not IG_TOKEN: return
    r = requests.post(f"https://graph.facebook.com/v21.0/me/messages", json={"recipient":{"id":sid},"message":{"text":text},"access_token":IG_TOKEN})
    print(f"DM Status: {r.status_code} {r.text}")

@app.route('/')
def home(): return "Running"

@app.route('/webhook/instagram', methods=['GET'])
def verify():
    if request.args.get('hub.mode')=='subscribe' and request.args.get('hub.verify_token')==VERIFY_TOKEN:
        return request.args.get('hub.challenge'),200
    return 'Fail',403

@app.route('/webhook/instagram', methods=['POST'])
def incoming():
    data=request.json
    print("Webhook:",data)
    if not data: return 'OK',200
    for entry in data.get('entry',[]):
        for change in entry.get('changes',[]):
            if change.get('field')=='comments':
                v=change.get('value',{})
                if v.get('id') and v.get('text'):
                    print(f"COMMENT MILA: {v.get('text')}")
                    send_comment_reply(v.get('id'), get_ai_reply(v.get('text')))
        for msg in entry.get('messaging',[]):
            if 'message' in msg and 'message_edit' not in msg['message']:
                if 'text' in msg['message'] and not msg['message'].get('is_echo'):
                    print(f"REAL DM: {msg['message']['text']}")
                    send_dm_reply(msg['sender']['id'], get_ai_reply(msg['message']['text']))
    return 'OK',200

if __name__=='__main__': app.run(host='0.0.0.0',port=10000)
