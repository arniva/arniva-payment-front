import crypto from 'crypto';

/**
 * Client-side hash calculation for Netspay Hash Version 3
 * This will be used in the browser to calculate hash without exposing store key
 */

// This function will be called from the server-side to generate client-safe hash calculation
export function generateClientHashScript(storeKey: string): string {
    return `
function escapeParameterValue(value) {
    return value.replace(/\\\\/g, '\\\\\\\\').replace(/\\|/g, '\\\\|');
}

function createNestpayHashV3(parameters, storeKey) {
    const paramMap = {};
    
    for (const [key, value] of Object.entries(parameters)) {
        const lowerKey = key.toLowerCase();
        if (lowerKey !== 'encoding' && lowerKey !== 'hash') {
            paramMap[key] = String(value);
        }
    }
    
    const sortedKeys = Object.keys(paramMap).sort((a, b) => 
        a.toUpperCase().localeCompare(b.toUpperCase())
    );
    
    const hashDataParts = [];
    for (const key of sortedKeys) {
        const escapedValue = escapeParameterValue(paramMap[key]);
        hashDataParts.push(escapedValue);
    }
    
    hashDataParts.push(storeKey);
    const hashData = hashDataParts.join('|');
    
    // Use crypto-js for SHA-512 in browser
    const hash = CryptoJS.SHA512(hashData).toString(CryptoJS.enc.Base64);
    return hash;
}

// Store key (normally this would be more securely handled)
window.NESTPAY_STORE_KEY = '${storeKey}';
`;
}