export class CloudFlareMailDecryptor {

    private Decrypt(encrypted: string): string {
        let decrypted = '';
        const key = parseInt(encrypted.substr(0, 2), 16) || 0;
        for(let i = 2; i < encrypted.length; i += 2) {
            const char = parseInt(encrypted.substr(i, 2), 16) ^ key;
            decrypted += '%' + char.toString(16).padStart(2, '0');
        }
        return decodeURIComponent(decrypted);
    }

    public Transform(element: HTMLAnchorElement | HTMLSpanElement): void {
        if(element.dataset.cfemail) {
            element.textContent = this.Decrypt(element.dataset.cfemail);
        } else {
            for(let span of element.querySelectorAll('span[data-cfemail]') as NodeListOf<HTMLSpanElement>) {
                this.Transform(span);
            }
        }
    }
}