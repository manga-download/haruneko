import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'topmanhuanet',
        title: 'LatestManga'
    },
    container: {
        url: 'https://latest-manga.com/manga/jujutsu-kaisen/',
        id: JSON.stringify({ post: '1902', slug: '/manga/jujutsu-kaisen/' }),
        title: 'Jujutsu Kaisen'
    },
    child: {
        id: '/manga/jujutsu-kaisen/vol-01/ch-001_3/',
        title: 'Ch.001'
    },
    entry: {
        index: 1,
        size: 183_751,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());