async function supabaseRestAudit() {
    const url = "https://thvdfcogdxmqipybqzot.supabase.co/rest/v1/visa_applications?select=count";
    const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRodmRmY29nZHhtcWlweWJxem90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NzIyODUsImV4cCI6MjA4NDI0ODI4NX0.GYgDsWSzI7UYRWYG38hi89IxeowsOXUdxdXiUyGOCpA";

    try {
        console.log('--- SUPABASE REST AUDIT ---');
        const res = await fetch(url, {
            headers: {
                "apikey": anonKey,
                "Authorization": `Bearer ${anonKey}`,
                "Range": "0-0",
                "Prefer": "count=exact"
            }
        });
        
        console.log(`Applications Count Status: ${res.status}`);
        const contentRange = res.headers.get("content-range");
        console.log(`Applications Count (from Content-Range): ${contentRange}`);

        // Try Invoices
        const invRes = await fetch("https://thvdfcogdxmqipybqzot.supabase.co/rest/v1/invoices?select=count", {
            headers: {
                "apikey": anonKey,
                "Authorization": `Bearer ${anonKey}`,
                "Range": "0-0",
                "Prefer": "count=exact"
            }
        });
        console.log(`Invoices Count Status: ${invRes.status}`);
        console.log(`Invoices Count (from Content-Range): ${invRes.headers.get("content-range")}`);

    } catch (err) {
        console.error('REST Audit failed:', err.message);
    }
}

supabaseRestAudit();
