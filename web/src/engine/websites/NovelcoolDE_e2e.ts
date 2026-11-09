import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'novelcool-de',
        title: 'Novel Cool (German)'
    },
    container: {
        url: 'https://de.novelcool.com/novel/Blue-Lock.html',
        id: '/novel/Blue-Lock.html',
        title: 'Blue Lock',
    },
    child: {
        id: '/chapter/Kapitel-1/9327480/',
        title: 'Kapitel 1',
    }, /* DE image hosting is broken
    entry: {
        index: 0,
        size: -1,
        type: 'image/webp'
    }*/
}).AssertWebsite();