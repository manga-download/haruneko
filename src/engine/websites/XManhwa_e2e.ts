import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'xmanhwa',
        title: 'XManhwa'
    },
    container: {
        url: 'https://www.manhwaden.com/manga/someone-stop-her/',
        id: JSON.stringify({ post: '28394', slug: '/manga/someone-stop-her/' }),
        title: 'Someone Stop Her!'
    },
    child: {
        id: '/manga/someone-stop-her/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 52_837,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();