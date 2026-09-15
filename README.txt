==========================================
GLOBAL HOMES - AI REAL ESTATE CHATBOT
Complete Setup Instructions
==========================================

REQUIREMENTS (All Free):
1. Groq API Key - console.groq.com
2. Google Account (for Sheets)
3. Formspree Account - formspree.io
4. Vercel Account - vercel.com
5. GitHub Account - github.com

==========================================
STEP 1: GET GROQ API KEY
==========================================
1. Go to console.groq.com
2. Sign up with Google (free)
3. Click "API Keys" → "Create API Key"
4. Copy the key (starts with gsk_...)

==========================================
STEP 2: CREATE GOOGLE SHEET
==========================================
1. Go to sheets.google.com
2. Create new spreadsheet: "Leads"
3. In Row 1, add headers:
   A1: Date | B1: Name | C1: Phone | D1: Budget | E1: Location | F1: Summary
4. Copy Sheet ID from URL

==========================================
STEP 3: SETUP APPS SCRIPT
==========================================
1. Go to script.google.com
2. Create New Project
3. Delete default code, paste code from "apps-script.js"
4. Replace "YOUR_GOOGLE_SHEET_ID_HERE" with your Sheet ID
5. Save
6. Deploy → New Deployment → Web App
7. Execute as: Me
8. Who has access: Anyone
9. Deploy → Authorize → Advanced → Allow
10. Copy the Web App URL

==========================================
STEP 4: CREATE FORMSPREE ACCOUNT
==========================================
1. Go to formspree.io
2. Sign up free
3. Create new form "Global Homes Leads"
4. Verify your email
5. Copy the endpoint URL

==========================================
STEP 5: CONFIGURE config.js
==========================================
Open config.js and replace all placeholder values:
- "Your Business Name" → Your business name
- "YOUR_WHATSAPP_NUMBER" → Your WhatsApp number
- "your@email.com" → Your email
- "YOUR_APPS_SCRIPT_WEB_APP_URL" → Paste Step 3 URL
- "YOUR_FORMSPREE_ENDPOINT" → Paste Step 4 URL
- "admin123" → Your admin password
- "Add your services here" → Your services list

==========================================
STEP 6: DEPLOY TO VERCEL
==========================================
1. Create GitHub account (free)
2. Create new repository: "global-homes-bot"
3. Upload all files (index.html, config.js, admin.html, api/chat.js)
4. Go to vercel.com → Sign up with GitHub
5. Click "Add New" → "Project"
6. Import your GitHub repository
7. Add Environment Variable:
   - Key: GROQ_API_KEY
   - Value: (your Groq key from Step 1)
8. Click "Deploy"

==========================================
STEP 7: COMPLETED
==========================================
Your bot is live at: https://your-project.vercel.app
Admin panel: https://your-project.vercel.app/admin.html
Password: (your admin password)

==========================================
IMPORTANT: FOLDER STRUCTURE
==========================================
Your files MUST be in this structure:

global-homes-bot/
├── index.html
├── config.js
├── admin.html
├── README.txt
├── apps-script.js
└── api/
    └── chat.js

If "chat.js" is not inside the "api" folder,
the chatbot will NOT work on Vercel.

==========================================
SUPPORT
==========================================
For questions, contact: support@yourdomain.com