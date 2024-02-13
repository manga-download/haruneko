import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'gekkouscans',
        title: 'Gekkou Scans'
    },
    container: {
        url: 'https://gekkou.site/manga/a29c1576-d191-479a-8206-f7df70e9a7c8/',
        id: JSON.stringify({ post: '1897', slug: '/manga/a29c1576-d191-479a-8206-f7df70e9a7c8/' }),
        title: 'ꜱᴏᴜꜱᴏᴜ ɴᴏ ꜰʀɪᴇʀᴇɴ'
    },
    child: {
        id: '/manga/a29c1576-d191-479a-8206-f7df70e9a7c8/capitulo-118/',
        title: 'Capítulo 118'
    },
    entry: {
        index: 1,
        size: 967_904,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());