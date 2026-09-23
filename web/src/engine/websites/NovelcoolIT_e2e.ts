import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'novelcool-it',
        title: 'Novel Cool (Italian)'
    },
    container: {
        url: 'https://it.novelcool.com/novel/Blue-Lock.html',
        id: '/novel/Blue-Lock.html',
        title: 'Blue Lock',
    },
    child: {
        id: '/chapter/33-Attacco-a-catena/6079258/',
        title: '33 Attacco a catena',
    },
    entry: {
        index: 1,
        size: 86_014,
        type: 'image/webp'
    }
}).AssertWebsite();