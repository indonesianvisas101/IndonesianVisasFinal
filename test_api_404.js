async function testApi() {
    try {
        console.log('--- API 404 TEST ---');
        const urls = [
            'http://localhost:3000/api/visas',
            'http://localhost:3000/api/user/profile',
            'http://localhost:3000/api/invoices?isAdmin=true'
        ];

        for (const url of urls) {
            try {
                const res = await fetch(url, { method: 'HEAD' });
                console.log(`[${url}] Status: ${res.status}`);
            } catch (err) {
                console.log(`[${url}] Fetch Error: ${err.message}`);
            }
        }
    } catch (err) {
        console.error('API test failed:', err);
    }
}

testApi();
