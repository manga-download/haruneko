import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangarose',
        title: 'MangaRose'
    },
    container: {
        url: 'https://mangarose.net/manga/operation-name-pure-love/',
        id: JSON.stringify({ post: '322', slug: '/manga/operation-name-pure-love/' }),
        title: 'Operation Name Pure Love'
    },
    child: {
        id: '/manga/operation-name-pure-love/108/',
        title: '108'
    },
    entry: {
        index: 0,
        size: 790_870,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();