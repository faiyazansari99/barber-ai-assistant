const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req,res) => res.send('Bot is running'));

app.get('/webhook/instagram', (req,res) => {
  if(req.query['hub.verify_token'] === 'apnabot_verify_123'){
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook/instagram', (req,res) => {
  console.log(req.body);
  res.sendStatus(200);
});

app.listen(10000, () => console.log('Server ON'));
