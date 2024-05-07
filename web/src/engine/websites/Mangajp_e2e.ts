import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangajp',
        title: '漫画RAW(mangajp)'
    },
    container: {
        url: 'https://mangajp.top/manga/en-no-shita-no-chikaramocha/',
        id: '/manga/en-no-shita-no-chikaramocha/',
        title: 'En No Shita No Chikaramocha'
    },
    child: {
        id: '/en-no-shita-no-chikaramocha-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 97_988,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());