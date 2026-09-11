@app.route('/webhook/instagram', methods=['POST'])
def receive_instagram():
    data = request.json
    print("Webhook Aaya:", data)
    if not data: return 'OK', 200

    for entry in data.get('entry', []):
        # Comments
        for change in entry.get('changes', []):
            if change.get('field') == 'comments':
                v = change.get('value', {})
                cid = v.get('id')
                text = v.get('text','')
                if cid and text and v.get('from',{}).get('id') != entry.get('id'):
                    print(f"COMMENT MILA: {text}")
                    reply = get_ai_reply(text)
                    send_comment_reply(cid, reply)

        # Real DMs - message_edit ko ignore karo
        for m in entry.get('messaging', []):
            if 'message' in m and 'message_edit' not in m.get('message', {}):
                if 'text' in m['message'] and not m['message'].get('is_echo'):
                    sid = m['sender']['id']
                    txt = m['message']['text']
                    print(f"REAL DM MILA: {txt}")
                    reply = get_ai_reply(txt)
                    send_dm_reply(sid, reply)
    return 'OK', 200
