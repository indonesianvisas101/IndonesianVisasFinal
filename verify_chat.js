
// Native fetch in Node 18+
async function checkChat() {
    console.log("Testing /api/chat endpoint...");
    try {
        const res = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Hello' }]
            })
        });

        if (!res.ok) {
            console.error("❌ API Failed:", res.status, res.statusText);
            const text = await res.text();
            console.error("Response:", text);
        } else {
            console.log("✅ API Success! Stream started.");
            console.log("Status:", res.status);
            const text = await res.text();
            // Check if it's an error JSON disguised as 200 (rare but possible) or real stream
            console.log("Preview:", text.substring(0, 100));
        }
    } catch (e) {
        console.error("❌ Network/Script Error:", e);
    }
}

checkChat();
