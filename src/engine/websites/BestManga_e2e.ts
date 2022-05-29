import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'bestmanga',
        title: 'Best Manga'
    },
    container: {
        url: 'https://bestmanga.club/manga/istinnaya-krasota/',
        id: JSON.stringify({ post: '24260', slug: '/manga/istinnaya-krasota/' }),
        title: 'Истинная красота'
    },
    child: {
        id: '/manga/istinnaya-krasota/glava-0-prolog/',
        title: 'Глава 0 Пролог'
    },
    entry: {
        index: 0,
        size: 1_120_446,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());