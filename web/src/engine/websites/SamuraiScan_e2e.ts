import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'samuraiscan',
        title: 'Samurai Scan'
    },
    container: {
        url: 'https://samurai.j5z.xyz/son/senda-del-emperador-astral/',
        id: JSON.stringify({ post: '39', slug: '/son/senda-del-emperador-astral/' }),
        title: 'Senda del Emperador Astral'
    },
    child: {
        id: '/son/senda-del-emperador-astral/capitulo-1/',
        title: 'Capitulo 1',
    },
    entry: {
        index: 1,
        size: 106_120,
        type: 'image/webp'
    }
}).AssertWebsite();