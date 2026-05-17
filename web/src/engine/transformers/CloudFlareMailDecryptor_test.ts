import { describe, it, expect } from 'vitest';
import { CloudFlareMailDecryptor } from './CloudFlareMailDecryptor';

describe('CloudFlareMailDecryptor', () => {

    // TODO: Migrate to browser test
    describe.skip('Transform()', () => {

        it.each([
            ['#mail-text > a', '[email\xa0protected]', 'contact@secret.mail'],
            ['#anchor_no-href_mail-text > a', '[email\xa0protected]', 'contact@secret.mail'],
            ['#anchor_mail-href_text > a', 'Contact', 'Contact'],
            ['#anchor_mail-href_mail-text > a', '[email\xa0protected]', 'contact@secret.mail'],
            ['#anchor_href_mail-text > a', '[email\xa0protected]', 'contact@secret.mail'],
        ])('Should transform obfuscated E-Mail addresses', async (selector: string, raw: string, expected: string) => {
            // const dom = await JSDOM.fromFile(path.resolve('test', 'cloudflare-mail.html'));
            // const dom = await JSDOM.fromURL('https://cloudflare.bot-check.ovh/mail');
            const dom = {} as Window;
            const testee = new CloudFlareMailDecryptor();
            const element = dom.window.document.body.querySelector<HTMLAnchorElement>(selector);
            expect(element.text).toBe(raw);
            testee.Transform(element);
            expect(element.text).toBe(expected);
        });
    });
});