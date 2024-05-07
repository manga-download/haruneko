import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaokutr',
        title: 'Manga Oku TR'
    },
    container: {
        url: 'https://mangaokutr.com/manga/youngest-scion-of-the-mages/',
        id: '/manga/youngest-scion-of-the-mages/',
        title: 'Youngest Scion of the Mages'
    },
    child: {
        id: '/youngest-scion-of-the-mages-bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 275_764,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());