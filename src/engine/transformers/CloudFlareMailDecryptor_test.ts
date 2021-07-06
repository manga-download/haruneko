import { JSDOM, ResourceLoader, FetchOptions, AbortablePromise } from 'jsdom';
import { CloudFlareMailDecryptor } from './CloudFlareMailDecryptor';
import fetch from 'node-fetch';

const jsdomResourceLoader = new class BypassResourceLoader extends ResourceLoader {
    fetch(url: string, options: FetchOptions): AbortablePromise<Buffer> | null {
        if(/^https?:\/\/test\.cloudscraper\.cf/.test(url)) {
            return super.fetch(url, options);
        } else {
            console.warn('Blocked fetching JSDOM resource:', url);
            return null;
        }
    }
}();

describe('CloudFlareMailDecryptor', () => {

    describe('Transform()', () => {

        it('Should work on GitHub Actions', async () => {
            try {
                const response = await fetch('https://test.cloudscraper.cf/mail');
                const data = await response.text();
                console.log('Response Text:', response.status, response.statusText, data);
                const dom = await JSDOM.fromURL('https://test.cloudscraper.cf/mail', { resources: jsdomResourceLoader });
                console.log('DOM', dom);
            } catch(error) {
                console.warn('Fetch Error:', error);
            }
        });

        it('Should transform anchor without link and with mail text', async () => {
            const dom = await JSDOM.fromURL('https://test.cloudscraper.cf/mail', { resources: jsdomResourceLoader });
            const testee = new CloudFlareMailDecryptor();
            const element = dom.window.document.body.querySelector('#mail-text a') as HTMLAnchorElement;
            expect(element.text).toBe('[email\xa0protected]');
            testee.Transform(element);
            expect(element.text).toBe('contact@secret.mail');
        });

        it('Should transform anchor without link and  with mail text span', async () => {
            const dom = await JSDOM.fromURL('https://test.cloudscraper.cf/mail', { resources: jsdomResourceLoader });
            const testee = new CloudFlareMailDecryptor();
            const element = dom.window.document.body.querySelector('#anchor_no-href_mail-text a') as HTMLAnchorElement;
            expect(element.text).toBe('[email\xa0protected]');
            testee.Transform(element);
            expect(element.text).toBe('contact@secret.mail');
        });

        it('Should not transform anchor with mail-link and plain text', async () => {
            const dom = await JSDOM.fromURL('https://test.cloudscraper.cf/mail', { resources: jsdomResourceLoader });
            const testee = new CloudFlareMailDecryptor();
            const element = dom.window.document.body.querySelector('#anchor_mail-href_text a') as HTMLAnchorElement;
            expect(element.text).toBe('Contact');
            testee.Transform(element);
            expect(element.text).toBe('Contact');
        });

        it('Should transform anchor with mail-link and mail text span', async () => {
            const dom = await JSDOM.fromURL('https://test.cloudscraper.cf/mail', { resources: jsdomResourceLoader });
            const testee = new CloudFlareMailDecryptor();
            const element = dom.window.document.body.querySelector('#anchor_mail-href_mail-text a') as HTMLAnchorElement;
            expect(element.text).toBe('[email\xa0protected]');
            testee.Transform(element);
            expect(element.text).toBe('contact@secret.mail');
        });

        it('Should transform anchor with web-link and mail text span', async () => {
            const dom = await JSDOM.fromURL('https://test.cloudscraper.cf/mail', { resources: jsdomResourceLoader });
            const testee = new CloudFlareMailDecryptor();
            const element = dom.window.document.body.querySelector('#anchor_href_mail-text a') as HTMLAnchorElement;
            expect(element.text).toBe('[email\xa0protected]');
            testee.Transform(element);
            expect(element.text).toBe('contact@secret.mail');
        });
    });
});