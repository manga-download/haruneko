import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'lhtranslation',
        title: 'LHTranslation'
    },
    container: {
        url: 'https://lhtranslation.net/manga/kuro-no-shoukanshi/',
        id: JSON.stringify({ post: '1942', slug: '/manga/kuro-no-shoukanshi/' }),
        title: 'Kuro no Shoukanshi'
    },
    child: {
        id: '/manga/kuro-no-shoukanshi/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 930_084,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());