import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangasefiri',
        title: 'Manga Sefiri'
    },
    container: {
        url: 'https://mangasefiri.com/manga/evolution-begins-with-a-big-tree',
        id: '/manga/evolution-begins-with-a-big-tree',
        title: 'Evolution Begins with a Big Tree'
    },
    child: {
        id: '/chapter/1278/evolution-begins-with-a-big-tree-bolum-148',
        title: 'Bölüm 148'
    },
    entry: {
        index: 8,
        size: 1_448_543,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());