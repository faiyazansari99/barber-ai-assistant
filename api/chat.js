// ============================================
// GLOBAL HOMES - AI CHAT BACKEND
// ============================================
// This file handles all AI requests.
// It supports both Groq and Gemini APIs.
// Client can choose their provider in config.js
// ============================================

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { message, config, history } = req.body;
    
    // Get API keys from environment variables
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    
    // Determine which provider to use
    const provider = config.aiProvider || "groq";
    const model = config.aiModel || "openai/gpt-oss-120b";

    // Check if the required API key is present
    if (provider === "groq" && !groqKey) {
        return res.status(500).json({ reply: "Groq API Key missing. Add GROQ_API_KEY in Vercel Environment Variables." });
    }
    if (provider === "gemini" && !geminiKey) {
        return res.status(500).json({ reply: "Gemini API Key missing. Add GEMINI_API_KEY in Vercel Environment Variables." });
    }
    if (!config) return res.status(500).json({ reply: "Configuration missing." });

    try {
        // Build the system prompt from config
        let finalPrompt = config.systemPrompt
            .replace(/{businessName}/g, config.businessName || "")
            .replace(/{businessType}/g, config.businessType || "")
            .replace(/{services}/g, config.services || "")
            .replace(/{whatsappNumber}/g, config.whatsappNumber || "")
            .replace(/{email}/g, config.email || "")
            .replace(/{address}/g, config.address || "");

        let reply = "";

        // ============================================
        // CALL AI BASED ON SELECTED PROVIDER
        // ============================================
        if (provider === "gemini") {
            // ============ GEMINI API ============
            const geminiMessages = history ? history.map(m => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }]
            })) : [];
            geminiMessages.push({ role: "user", parts: [{ text: message }] });

            const geminiRes = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system_instruction: { parts: [{ text: finalPrompt }] },
                        contents: geminiMessages
                    })
                }
            );
            const geminiData = await geminiRes.json();
            if (!geminiData.candidates || !geminiData.candidates[0]) {
                return res.status(500).json({ reply: "Gemini API Error: " + (geminiData.error?.message || "Unknown") });
            }
            reply = geminiData.candidates[0].content.parts[0].text;
            
        } else {
            // ============ GROQ API ============
            const messages = [{ role: "system", content: finalPrompt }];
            if (history && history.length) {
                history.forEach(m => messages.push({ role: m.role, content: m.content }));
            }
            messages.push({ role: "user", content: message });

            const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${groqKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 500
                })
            });
            const groqData = await groqRes.json();
            if (!groqData.choices || !groqData.choices[0]) {
                return res.status(500).json({ reply: "Groq API Error: " + (groqData.error?.message || "Unknown") });
            }
            reply = groqData.choices[0].message.content;
        }

        // ============================================
        // LEAD CAPTURE SYSTEM
        // ============================================
        const fullText = (message || "") + " " + reply;
        const phoneMatch = fullText.match(/(\+?\d[\d\s\-]{8,14}\d)/);
        
        if (phoneMatch) {
            const budgetMatch = fullText.match(/(\d+\s*(lakh|lac|crore|cr|k))/i);
            const locationMatch = fullText.match(/(andheri|bandra|juhu|thane|pune|mumbai|delhi|dubai|london|new york)/i);
            
            const leadData = {
                name: "Customer",
                phone: phoneMatch[0],
                budget: budgetMatch ? budgetMatch[0] : "N/A",
                location: locationMatch ? locationMatch[0] : "N/A",
                summary: fullText.substring(0, 300)
            };

            // Send to Formspree (Email)
            if (config.formspreeEndpoint && !config.formspreeEndpoint.includes("YOUR_FORMSPREE")) {
                try {
                    await fetch(config.formspreeEndpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify(leadData)
                    });
                } catch (e) { console.log("Formspree Error:", e.message); }
            }

            // Send to Google Sheet
            if (config.googleSheetUrl && !config.googleSheetUrl.includes("YOUR_APPS_SCRIPT")) {
                try {
                    await fetch(config.googleSheetUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(leadData)
                    });
                } catch (e) { console.log("Google Sheet Error:", e.message); }
            }
        }

        return res.status(200).json({ reply });

    } catch (error) {
        return res.status(500).json({ reply: "Server Error: " + error.message });
    }
}
