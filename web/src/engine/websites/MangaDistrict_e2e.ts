import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangadistrict',
        title: 'MangaDistrict'
    },
    container: {
        url: 'https://mangadistrict.com/read-scan/no-mans-land/',
        id: JSON.stringify({ post: '114637', slug: '/read-scan/no-mans-land/' }),
        title: `No Man’s Land`
    },
    child: {
        id: '/read-scan/no-mans-land/chapter-48/',
        title: 'Chapter 48 - The Missing Queen'
    },
    entry: {
        index: 0,
        size: 1_081_770,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());