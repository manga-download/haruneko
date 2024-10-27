import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'pawmanga',
        title: 'PawManga'
    },
    container: {
        url: 'https://pawmanga.com/manga/ancient-god-games/',
        id: JSON.stringify({ post: '29716', slug: '/manga/ancient-god-games/'}),
        title: 'Ancient God Games'
    },
    child: {
        id: '/manga/ancient-god-games/chapter-44/',
        title: 'Chapter 44'
    },
    entry: {
        index: 1,
        size: 53_744,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();