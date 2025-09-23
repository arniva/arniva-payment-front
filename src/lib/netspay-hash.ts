import crypto from 'crypto';

/**
 * Netspay Hash Version 3 implementation
 * Uses SHA-512 algorithm with base64 encoding
 * Parameters are sorted alphabetically and separated by "|"
 */

/**
 * Escapes special characters in parameter values for hash calculation
 * - "|" characters become "\|"  
 * - "\" characters become "\\"
 */
function escapeParameterValue(value: string): string {
    return value
        .replace(/\\/g, '\\\\')  // Replace \ with \\
        .replace(/\|/g, '\\|');  // Replace | with \|
}

/**
 * Creates a hash for Netspay Hash Version 3 request
 * @param parameters - Object containing all parameters to be sent to Netspay
 * @param storeKey - Store key from Netspay
 * @returns Base64 encoded SHA-512 hash
 */
export function createNestpayHashV3(parameters: Record<string, string | number>, storeKey: string): string {
    // Convert all parameters to strings and exclude only 'encoding' and 'hash' parameters
    // as per Netspay sample codes
    const paramMap: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(parameters)) {
        const lowerKey = key.toLowerCase();
        if (lowerKey !== 'encoding' && lowerKey !== 'hash') {
            paramMap[key] = String(value);
        }
    }
    
    // Sort parameter names alphabetically (case-insensitive as per samples)
    const sortedKeys = Object.keys(paramMap).sort((a, b) => 
        a.toUpperCase().localeCompare(b.toUpperCase())
    );
    
    // Build the hash data string with escaped values
    const hashDataParts: string[] = [];
    for (const key of sortedKeys) {
        const escapedValue = escapeParameterValue(paramMap[key]);
        hashDataParts.push(escapedValue);
    }
    
    // Add store key at the end
    hashDataParts.push(storeKey);
    
    // Join with "|" separator
    const hashData = hashDataParts.join('|');
    
    console.log('Hash V3 calculation:');
    console.log('Sorted keys:', sortedKeys);
    console.log('Hash data string:', hashData);
    
    // Create SHA-512 hash and encode as base64
    const hash = crypto.createHash('sha512').update(hashData, 'utf8').digest('base64');
    console.log('Final hash:', hash);
    
    return hash;
}

/**
 * Verifies a hash from Netspay response
 * @param responseParameters - Parameters received from Netspay
 * @param storeKey - Store key from Netspay
 * @param receivedHash - Hash value received from Netspay (usually in 'HASH' parameter)
 * @returns True if hash is valid, false otherwise
 */
export function verifyNestpayHashV3(
    responseParameters: Record<string, string | number>, 
    storeKey: string, 
    receivedHash: string
): boolean {
    // Use the same exclusion logic as hash creation - only exclude 'encoding' and 'hash'
    const filteredParams: Record<string, string | number> = {};
    
    for (const [key, value] of Object.entries(responseParameters)) {
        const lowerKey = key.toLowerCase();
        if (lowerKey !== 'encoding' && lowerKey !== 'hash' && lowerKey !== 'countdown') {
            filteredParams[key] = value;
        }
    }
    
    const calculatedHash = createNestpayHashV3(filteredParams, storeKey);
    return calculatedHash === receivedHash;
}