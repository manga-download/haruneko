import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'isekaiscan',
        title: 'Isekai Scan'
    },
    container: {
        url: 'https://isekaiscan.com/manga/magic-emperor/',
        id: JSON.stringify({ post: '16763', slug: '/manga/magic-emperor/' }),
        title: 'Magic Emperor'
    },
    child: {
        id: '/manga/magic-emperor/chapter-1/',
        title: 'chapter 1'
    },
    entry: {
        index: 0,
        size: 56_861,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());