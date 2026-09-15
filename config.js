// ============================================
// GLOBAL HOMES - CONFIGURATION FILE
// ============================================
// This file contains all the settings for your AI chatbot.
// Replace the placeholder values with your own information.
// ============================================

const CLIENT_CONFIG = {
    // ============================================
    // SECTION 1: BUSINESS INFORMATION
    // ============================================
    // Enter your business name, tagline, and type.
    // Example: "Global Homes", "Your Dream Home Awaits", "Real Estate"
    // ============================================
    businessName: "Global Homes",
    businessTagline: "Your Dream Home Awaits",
    businessType: "Real Estate",
    
    // ============================================
    // SECTION 2: CONTACT INFORMATION
    // ============================================
    // Enter your WhatsApp number (with country code, without + sign).
    // Example: For India, use "919876543210"
    // ============================================
    whatsappNumber: "919999999999",
    phoneNumber: "+91 99999 99999",
    email: "info@globalhomes.com",
    address: "Business Bay, Dubai, UAE",
    
    // ============================================
    // SECTION 3: GOOGLE SHEET INTEGRATION
    // ============================================
    // Paste your Google Apps Script Web App URL here.
    // See README.txt for instructions on how to get this URL.
    // ============================================
    googleSheetUrl: "YOUR_APPS_SCRIPT_WEB_APP_URL",
    
    // ============================================
    // SECTION 4: FORMSPREE EMAIL INTEGRATION
    // ============================================
    // Paste your Formspree endpoint URL here.
    // See README.txt for instructions on how to get this URL.
    // ============================================
    formspreeEndpoint: "YOUR_FORMSPREE_ENDPOINT",
    
    // ============================================
    // SECTION 5: ADMIN DASHBOARD PASSWORD
    // ============================================
    // Set a password to protect your admin dashboard.
    // ============================================
    adminPassword: "admin123",
    
    // ============================================
    // SECTION 6: SERVICES OR PROPERTIES LIST
    // ============================================
    // Enter your services or properties with prices.
    // ============================================
    services: `
    Available Properties:
    - 1BHK Thane: 45 Lakh
    - 2BHK Andheri: 85 Lakh
    - 3BHK Bandra: 2.5 Crore
    - 4BHK Juhu: 5 Crore
    - 2BHK Pune (Hinjewadi): 65 Lakh
    `,
    
    // ============================================
    // SECTION 7: QUICK REPLY BUTTONS
    // ============================================
    // These buttons appear at the bottom of the chat.
    // ============================================
    quickReplies: ["💰 Budget", "📍 Location", "🏠 2BHK", "📞 Contact"],
    
    // ============================================
    // SECTION 8: AI MODEL SELECTION
    // ============================================
    // Choose your AI model based on your API key.
    // 
    // OPTION 1: Groq (Fast & Free)
    // - Get API key from: console.groq.com
    // - Recommended model: "openai/gpt-oss-120b"
    // - Other models: "meta-llama/llama-4-scout-17b-16e-instruct", "qwen/qwen3.6-27b"
    //
    // OPTION 2: Gemini (Powerful & Free Tier)
    // - Get API key from: aistudio.google.com
    // - Recommended model: "gemini-2.5-flash"
    // - Other models: "gemini-2.5-flash-lite", "gemini-2.5-pro"
    //
    // NOTE: You must add the API key in Vercel Environment Variables.
    // See README.txt for instructions.
    // ============================================
    
    // Select your AI provider: "groq" or "gemini"
    aiProvider: "groq",
    
    // Enter your preferred model name
    aiModel: "openai/gpt-oss-120b",
    
    // ============================================
    // SECTION 9: SUPPORTED LANGUAGES
    // ============================================
    // The chatbot will automatically detect and reply in the customer's language.
    // ============================================
    supportedLanguages: [
        "English",
        "Hindi",
        "Hinglish",
        "Arabic",
        "Spanish",
        "French",
        "German",
        "Chinese",
        "Japanese"
    ],
    
    // ============================================
    // SECTION 10: AI SYSTEM PROMPT
    // ============================================
    // This instructs the AI on how to behave.
    // You can customize this based on your business needs.
    // ============================================
    systemPrompt: `You are a professional AI Sales Assistant for {businessName}, a {businessType} company.

LANGUAGE RULES:
- Automatically detect the customer's language from their message.
- Reply in the SAME language the customer used.
- If the customer uses Hinglish (Hindi + English mix), reply in Hinglish.
- If the customer uses pure Hindi, reply in Hindi.
- If the customer uses English, reply in English.
- If the customer uses any other language (Arabic, Spanish, French, etc.), reply in that language.

BUSINESS RULES:
1. Warmly greet customers in their preferred language.
2. Ask one-by-one: (a) Budget, (b) Preferred Location, (c) BHK, (d) Possession time.
3. Based on their answers, suggest best property from: {services}
4. When customer is interested, ask for their "Name" and "Phone Number".
5. After getting phone number, say: "Thank you! Our team will call you in 10 minutes."
6. Only talk about real estate. Don't answer unrelated topics.
7. Keep replies short, professional, and friendly.

IMAGE & DOCUMENT HANDLING:
- If customer sends an image, analyze it and respond accordingly.
- If customer sends a document, extract key information and respond.

CONTACT INFO:
- WhatsApp: {whatsappNumber}
- Email: {email}
- Address: {address}`
};
