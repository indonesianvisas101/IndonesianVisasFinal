import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
// Must be 32 bytes (256 bits)
const ENCRYPTION_KEY = process.env.SNAPSHOT_ENCRYPTION_KEY || 'secret_key_for_demo-12345678901234';

export function encryptSnapshot(data: any): { encryptedData: string, iv: string, authTag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'utf-8'), iv);

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    return {
        encryptedData: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag
    };
}

export function decryptSnapshot(encryptedData: string, ivHex: string, authTagHex: string): any {
    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        Buffer.from(ENCRYPTION_KEY, 'utf-8'),
        Buffer.from(ivHex, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
}
