import { argon2id } from 'hash-wasm';
export async function sha256(plaintext: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    return crypto.subtle.digest('SHA-256', data);
}
/**
 * The parameters are based on the OWASP recommendations for Argon2id.
 * @see https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id 
 */
export async function derivePassword(password: string, salt: string) {
    return await argon2id({
        password,
        salt,
        hashLength: 128,
        memorySize: 12288, // 12MiB
        iterations: 3,
        parallelism: 1,
    })
}
export function arrayBufferToHex(buffer: ArrayBuffer) {
    return Array.from(new Uint8Array(buffer))
        .map(x => x.toString(16).padStart(2, '0'))
        .join('')
}

export const SALT_BIT_LENGTH = 128
export function randomSalt() {
    return crypto.getRandomValues(new Uint8Array(SALT_BIT_LENGTH))    
}

export async function sha256Hex(password: string) {
    const hashedBuffer = await sha256(password)
    return arrayBufferToHex(hashedBuffer)
}
