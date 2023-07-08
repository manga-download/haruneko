import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuascan',
        title: 'ManhuaScan'
    },
    container: {
        url: 'https://manhuascan.io/manga/wu-dong-qian-kun',
        id: '/manga/wu-dong-qian-kun' ,
        title: 'WU DONG QIAN KUN'
    },
    child: {
        id: '/manga/wu-dong-qian-kun/chapter-203',
        title: 'Chapter 203',
    },
    entry: {
        index: 1,
        size: 166_888,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());