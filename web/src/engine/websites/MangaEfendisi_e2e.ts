import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaefendisi',
        title: 'Manga Efendisi'
    },
    container: {
        url: 'https://mangaefendisi.net/manga/fighting-the-curse/',
        id: '/manga/fighting-the-curse/',
        title: 'Fighting the Curse'
    },
    child: {
        id: '/fighting-the-curse-bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 1,
        size: 1_089_525,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());