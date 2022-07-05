import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'crunchyscan',
        title: 'Crunchyscan'
    }/*,
    // CloudFlare challenge... cannot be bypassed yet with puppeteer
    container: {
        url: 'https://crunchyscan.fr/liste-manga/lucia/',
        id: JSON.stringify({ post: '1598', slug: '/liste-manga/lucia/' }),
        title: 'Lucia'
    },
    child: {
        id: 'https://crunchyscan.fr/liste-manga/lucia/#',
        title: 'Chapter ?'
    },
    // Custom Re-Captcha check... cannot be bypassed without user interaction
    entry: {
        index: 0,
        size: -1,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());