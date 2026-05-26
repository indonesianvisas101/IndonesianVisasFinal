const http = require('http');

function request(options, postData = null) {
    return new Promise((resolve, reject) => {
        const reqHeaders = options.headers || {};
        if (postData) {
            const dataStr = JSON.stringify(postData);
            reqHeaders['Content-Type'] = 'application/json';
            reqHeaders['Content-Length'] = Buffer.byteLength(dataStr);
        }
        
        const reqOptions = { ...options, headers: reqHeaders };
        
        const req = http.request(reqOptions, (res) => {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                let data = body;
                try { data = JSON.parse(body); } catch(e) {}
                resolve({ status: res.statusCode, data });
            });
        });
        
        req.on('error', (e) => reject(e));
        
        if (postData) {
            req.write(JSON.stringify(postData));
        }
        req.end();
    });
}

async function runTests() {
    console.log("=== STARTING SECURITY AUDIT FOR HARDENED ENDPOINTS ===");

    // Test 1: Admin Conversations
    try {
        console.log("\n[Test 1] Fetching admin conversations without token...");
        const res = await request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/admin/chat/conversations',
            method: 'GET'
        });
        console.log(`Status: ${res.status}`);
        console.log(`Response:`, JSON.stringify(res.data));
        if (res.status === 401 || res.status === 403) {
            console.log("✅ PASS: Endpoint is protected from anonymous access.");
        } else {
            console.log("❌ FAIL: Endpoint should be protected.");
        }
    } catch (e) {
        console.error("Test 1 error:", e.message);
    }

    // Test 2: Admin Messages
    try {
        console.log("\n[Test 2] Fetching admin messages without token...");
        const res = await request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/admin/chat/messages?conversationId=some-id',
            method: 'GET'
        });
        console.log(`Status: ${res.status}`);
        console.log(`Response:`, JSON.stringify(res.data));
        if (res.status === 401 || res.status === 403) {
            console.log("✅ PASS: Endpoint is protected from anonymous access.");
        } else {
            console.log("❌ FAIL: Endpoint should be protected.");
        }
    } catch (e) {
        console.error("Test 2 error:", e.message);
    }

    // Test 3: Admin Send
    try {
        console.log("\n[Test 3] Sending admin message without token...");
        const res = await request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/admin/chat/send',
            method: 'POST'
        }, { conversation_id: 'some-id', message: 'Hello' });
        console.log(`Status: ${res.status}`);
        console.log(`Response:`, JSON.stringify(res.data));
        if (res.status === 401 || res.status === 403) {
            console.log("✅ PASS: Endpoint is protected from anonymous access.");
        } else {
            console.log("❌ FAIL: Endpoint should be protected.");
        }
    } catch (e) {
        console.error("Test 3 error:", e.message);
    }

    // Test 4: Admin DB Fix
    try {
        console.log("\n[Test 4] Triggering fix-chat-db without token...");
        const res = await request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/admin/fix-chat-db',
            method: 'POST'
        });
        console.log(`Status: ${res.status}`);
        console.log(`Response:`, JSON.stringify(res.data));
        if (res.status === 401 || res.status === 403) {
            console.log("✅ PASS: Endpoint is protected from anonymous access.");
        } else {
            console.log("❌ FAIL: Endpoint should be protected.");
        }
    } catch (e) {
        console.error("Test 4 error:", e.message);
    }

    // Test 5: Chat Delete
    try {
        console.log("\n[Test 5] Deleting chat/message without token...");
        const res = await request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/chat/delete',
            method: 'DELETE'
        }, { id: 'some-id', type: 'conversation' });
        console.log(`Status: ${res.status}`);
        console.log(`Response:`, JSON.stringify(res.data));
        if (res.status === 401 || res.status === 403) {
            console.log("✅ PASS: Endpoint is protected from anonymous access.");
        } else {
            console.log("❌ FAIL: Endpoint should be protected.");
        }
    } catch (e) {
        console.error("Test 5 error:", e.message);
    }

    console.log("\n=== SECURITY AUDIT COMPLETED ===");
}

runTests();
