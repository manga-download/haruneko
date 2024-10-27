import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'atikrost',
        title: 'Atikrost'
    },
    container: {
        url: 'https://www.mangaoku.org/manga/i-am-the-grim-reaper-webtoon-oku/',
        id: JSON.stringify({ post: '51', slug: '/manga/i-am-the-grim-reaper-webtoon-oku/' }),
        title: 'I am the Grim Reaper'
    },
    child: {
        id: '/manga/i-am-the-grim-reaper-webtoon-oku/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 99_003,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();