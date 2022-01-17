// HACK: JSDOM requires access to Text Encoder/Decoder which are missing from jest-environment-jsdom
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { JSDOM } from 'jsdom';
import { CloudFlareMailDecryptor } from './CloudFlareMailDecryptor';
const url = 'https://test.cloudscraper.cf/mail';
const options = { pretendToBeVisual: true };

describe('CloudFlareMailDecryptor', () => {

    describe('Transform()', () => {

        it('Should transform anchor without link and with mail text', async () => {
            const dom = await JSDOM.fromURL(url, options);
            const testee = new CloudFlareMailDecryptor();
            const element = dom.window.document.body.querySelector('#mail-text a') as HTMLAnchorElement;
            expect(element.text).toBe('[email\xa0protected]');
            testee.Transform(element);
            expect(element.text).toBe('contact@secret.mail');
        });

        it('Should transform anchor without link and  with mail text span', async () => {
            const dom = await JSDOM.fromURL(url, options);
            const testee = new CloudFlareMailDecryptor();
            const element = dom.window.document.body.querySelector('#anchor_no-href_mail-text a') as HTMLAnchorElement;
            expect(element.text).toBe('[email\xa0protected]');
            testee.Transform(element);
            expect(element.text).toBe('contact@secret.mail');
        });

        it('Should not transform anchor with mail-link and plain text', async () => {
            const dom = await JSDOM.fromURL(url, options);
            const testee = new CloudFlareMailDecryptor();
            const element = dom.window.document.body.querySelector('#anchor_mail-href_text a') as HTMLAnchorElement;
            expect(element.text).toBe('Contact');
            testee.Transform(element);
            expect(element.text).toBe('Contact');
        });

        it('Should transform anchor with mail-link and mail text span', async () => {
            const dom = await JSDOM.fromURL(url, options);
            const testee = new CloudFlareMailDecryptor();
            const element = dom.window.document.body.querySelector('#anchor_mail-href_mail-text a') as HTMLAnchorElement;
            expect(element.text).toBe('[email\xa0protected]');
            testee.Transform(element);
            expect(element.text).toBe('contact@secret.mail');
        });

        it('Should transform anchor with web-link and mail text span', async () => {
            const dom = await JSDOM.fromURL(url, options);
            const testee = new CloudFlareMailDecryptor();
            const element = dom.window.document.body.querySelector('#anchor_href_mail-text a') as HTMLAnchorElement;
            expect(element.text).toBe('[email\xa0protected]');
            testee.Transform(element);
            expect(element.text).toBe('contact@secret.mail');
        });
    });
});