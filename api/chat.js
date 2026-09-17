export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { message, config, history } = req.body;
    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey) return res.status(500).json({ reply: "Groq API Key missing!" });
    if (!config) return res.status(500).json({ reply: "Config missing!" });

    try {
        // Build system prompt
        let finalPrompt = config.systemPrompt
            .replace(/{businessName}/g, config.businessName || "")
            .replace(/{businessType}/g, config.businessType || "")
            .replace(/{services}/g, config.services || "")
            .replace(/{whatsappNumber}/g, config.whatsappNumber || "")
            .replace(/{email}/g, config.email || "")
            .replace(/{address}/g, config.address || "");

        // Add instruction to avoid markdown
        finalPrompt += "\n\nIMPORTANT: Do NOT use asterisks (*), hashtags (#), or any markdown formatting. Write plain text only.";

        const messages = [{ role: "system", content: finalPrompt }];
        if (history && history.length) {
            history.forEach(m => messages.push({ role: m.role, content: m.content }));
        }
        messages.push({ role: "user", content: message });

        // Call Groq AI
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${groqKey}`
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-120b",
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        const groqData = await groqRes.json();
        if (!groqData.choices || !groqData.choices[0]) {
            return res.status(500).json({ reply: "API Error: " + (groqData.error?.message || "Unknown") });
        }

        // Get reply and remove asterisks
        let reply = groqData.choices[0].message.content;
        reply = reply.replace(/\*/g, '').replace(/#/g, '').replace(/_/g, '').replace(/`/g, '');

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

            // 1. Send to Formspree (Email)
            if (config.formspreeEndpoint && !config.formspreeEndpoint.includes("YOUR_FORM")) {
                try {
                    await fetch(config.formspreeEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(leadData)
                    });
                    console.log("Formspree: Lead sent");
                } catch (e) { 
                    console.log("Formspree Error:", e.message); 
                }
            }

            // 2. Send to Google Sheet
            if (config.googleSheetUrl && !config.googleSheetUrl.includes("YOUR_APPS")) {
                try {
                    await fetch(config.googleSheetUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(leadData)
                    });
                    console.log("Google Sheet: Lead sent");
                } catch (e) { 
                    console.log("Google Sheet Error:", e.message); 
                }
            }
        }

        return res.status(200).json({ reply });

    } catch (error) {
        return res.status(500).json({ reply: "Server Error: " + error.message });
    }
}
