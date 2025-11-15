import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'hipercool',
        title: 'Hiper Cool'
    },
    container: {
        url: 'https://hiper.cool/manga/nama-hone-josou/',
        id: JSON.stringify({post: '19381', slug: '/manga/nama-hone-josou/' }),
        title: 'Nama-Hone Josou'
    },
    child: {
        id: '/manga/nama-hone-josou/vol-1/',
        title: 'Vol. 1'
    },
    entry: {
        index: 0,
        size: 325_942,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();