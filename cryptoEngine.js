import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { randomBytes } from '@noble/ciphers/utils.js';
import { split, combine } from 'shamir-secret-sharing';

// 1. Generate 256-bit (32-byte) Master Key for XChaCha20
export const masterKey = randomBytes(32);

// 2. Split Master Key into 3 Shamir Shares with Threshold = 2 (2-of-3 Scheme)
let shamirShares = [];
(async () => {
  try {
    shamirShares = await split(masterKey, 3, 2);
    console.log('🔐 Shamir Secret Sharing Initialized (2-of-3 Threshold Scheme)');
  } catch (e) {
    console.error('Shamir Split Error:', e);
  }
})();

export const getShamirShares = () => shamirShares;

// 3. Reconstruct Master Key from any 2 Shamir Shares
export const reconstructKeyFromShamir = async (shareA, shareB) => {
  const reconstructedKey = await combine([shareA, shareB]);
  return reconstructedKey;
};

// 4. XChaCha20-Poly1305 Encrypt Function
export const encryptXChaCha20 = (text) => {
  if (!text || text === '') return '';
  try {
    const nonce = randomBytes(24); // 24-byte Nonce for XChaCha20
    const cipher = xchacha20poly1305(masterKey, nonce);
    const textBytes = new TextEncoder().encode(String(text));
    const ciphertextBytes = cipher.encrypt(textBytes);

    // Format: xchacha20:NONCE_HEX:CIPHERTEXT_HEX
    return `xchacha20:${Buffer.from(nonce).toString('hex')}:${Buffer.from(ciphertextBytes).toString('hex')}`;
  } catch (err) {
    console.error('XChaCha20 Encryption Error:', err);
    return text;
  }
};

// 5. XChaCha20-Poly1305 Decrypt Function using Master Key or Reconstructed Shamir Key
export const decryptXChaCha20 = (encryptedString, key = masterKey) => {
  if (!encryptedString || !encryptedString.startsWith('xchacha20:')) return encryptedString;
  try {
    const parts = encryptedString.split(':');
    if (parts.length !== 3) return encryptedString;

    const nonce = Buffer.from(parts[1], 'hex');
    const ciphertextBytes = Buffer.from(parts[2], 'hex');
    const cipher = xchacha20poly1305(key, nonce);

    const decryptedBytes = cipher.decrypt(ciphertextBytes);
    return new TextDecoder().decode(decryptedBytes);
  } catch (err) {
    console.error('XChaCha20 Decryption Error:', err);
    return '[DECRYPTION_FAILED]';
  }
};
