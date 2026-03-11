import { FetchWindowScript } from '../platform/FetchProvider';
import { GetBase64FromBytes, GetBytesFromBase64, GetBytesFromHex, GetBytesFromUTF8 } from '../BufferEncoder';
import { RandomText } from '../Random';

export class DRMProvider {

    private auth = {
        user: <string>null,
        global: RandomText(43), // Base64 (URL-flavored, non-padded) encoded random bytes (32 bytes ➔ 43 characters)
    };

    /**
     * Extract the Auth token directly from the website (e.g., after login/logout through manual website interaction)
     */
    public async UpdateAuthToken(uri: URL) {
        const script = `
            const localstoragePrefix = 'cZM1P6rkCfil';
            new Promise(resolve => {
                const n = parseInt(localStorage.getItem(localstoragePrefix + '_chunks'), 10);
                if (isNaN(n)) {
                    return resolve(null);
                }
                let r = '';
                for (let a = 0; a < n; a++) {
                    const t = localStorage.getItem(localstoragePrefix + '_' + a);
                    if (t === null) {
                        return resolve(null);
                    }
                    r += t;
                }
                resolve(r.split(':', 2));
            });
        `;
        try {
            const [iv, encrypted]= await FetchWindowScript<[string, string]>(new Request(uri), script, 750);
            const config: { authToken?: string } = JSON.parse(await this.#Decrypt(encrypted, iv));
            this.auth.user = config?.authToken || null;
        } catch (error) {
            console.warn('Failed to extract the current user authentication token', error);
            this.auth.user = null;
        }
    }

    /**
     * ...
     * @param encrypted - Base64 encoded data to be decrypted
     * @param iv - HEX representation of the initialization vector for decryption
     */
    async #Decrypt(encrypted: string, iv: string): Promise<string> {
        const algorithm = { name: 'AES-CBC', iv: GetBytesFromHex(iv) };
        const keyData = await crypto.subtle.digest('SHA-256', GetBytesFromUTF8('HIDUPJOKOWI!'));
        const key = await crypto.subtle.importKey('raw', keyData, algorithm, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(algorithm, key, GetBytesFromBase64(encrypted));
        return new TextDecoder().decode(decrypted);
    }

    public async GetHeaders(): Promise<HeadersInit> {
        /*
        async GetServerTimeOffset() {
            const { data: { time } } = await FetchJSON<{ data: { time: number } }>(new Request(new URL('./server-time', this.apiUrl)));
            return time - (Date.now() / 1000 >> 0);
        }
        */
        const seed = RandomText(43);
        const timestamp = Date.now() / 1000 >> 0; // - await GetServerTimeOffset();
        const headers = new Headers({
            'GlobalAuthorization': `Bearer ${this.auth.global}`,
            'X-SERVER-TIME': 'MzEwVFBTkbM7rcqWW_-',
            'X-REQUEST-SIGNATURE': await this.#GetSignature(timestamp, seed),
            'X-REQUEST-TIMESTAMP': `${timestamp}`,
            'X-REQUEST-HASH': seed,
        });
        if (this.auth.user) {
            headers.set('Authorization', `Bearer ${this.auth.user}`);
        };
        return headers;
    }

    async #GetSignature(timestamp: number, seed: string): Promise<string> {
        const keyData = `xyz|${timestamp}|Feat_19_JUTA_LAPANGAN_PEKERJAAN`;
        const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(keyData), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
        const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${seed}`));
        return GetBase64FromBytes(new Uint8Array(signature));
    }
};