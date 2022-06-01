import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'cizgiromanarsivi',
        title: 'Çizgi Roman Arşivi (CizgiRomanArsivi)'
    },
    // CloudFlare challenge... cannot be bypassed yet with puppeteer
    /*
    container: {
        url: 'https://cizgiromanarsivi.com/seri/nano-makine/',
        id: JSON.stringify({ post: '30', slug: '/seri/nano-makine/' }),
        title: 'Nano Machine'
    },
    child: {
        id: '/seri/nano-makine/1-bolum/',
        title: '1. Bölüm'
    },
    entry: {
        index: 0,
        size: 22_334,
        type: 'image/webp'
    }
    */
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());