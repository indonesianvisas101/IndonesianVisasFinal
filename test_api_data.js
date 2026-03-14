async function testApiData() {
    try {
        console.log('--- API DATA VERIFICATION ---');
        const urls = [
            'http://localhost:3000/api/visas',
            'http://localhost:3000/api/applications?isAdmin=true',
            'http://localhost:3000/api/invoices?isAdmin=true'
        ];

        for (const url of urls) {
            try {
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    console.log(`[${url}] Status: ${res.status}, Count: ${Array.isArray(data) ? data.length : 'Object'}`);
                } else {
                    console.log(`[${url}] Status: ${res.status}`);
                }
            } catch (err) {
                console.log(`[${url}] Fetch Error: ${err.message}`);
            }
        }
    } catch (err) {
        console.error('API test failed:', err);
    }
}

testApiData();
