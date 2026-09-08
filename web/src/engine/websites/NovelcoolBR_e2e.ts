import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'novelcool-br',
        title: 'Novel Cool (Portuguese)'
    },
    container: {
        url: 'https://br.novelcool.com/novel/Blue-Lock.html',
        id: '/novel/Blue-Lock.html',
        title: 'Blue Lock',
    },
    child: {
        id: '/chapter/Cap-tulo-339/13863096/',
        title: 'Capítulo 339',
    },
    entry: {
        index: 1,
        size: 74_372,
        type: 'image/webp'
    }
}).AssertWebsite();