import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaarab',
        title: 'مانجا العرب (Manga Al-arab)'
    },
    /* CloudFlare
    container: {
        url: 'https://manga.ae/1onepi-ece/',
        id: '/1onepi-ece/',
        title: 'ون بيس'
    },
    child: {
        id: 'https://manga.ae/1onepi-ece/1087/allpages',
        title: 'الفصل 1087 : سفن الملاكمة'
    },
    entry: {
        index: 0,
        size: 793_237,
        type: 'image/jpeg'
    }
    */
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());