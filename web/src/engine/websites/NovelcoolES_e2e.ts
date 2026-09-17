import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'novelcool-es',
        title: 'Novel Cool (Spanish)'
    },
    container: {
        url: 'https://es.novelcool.com/novel/A-Couple-Of-Cuckoos.html',
        id: '/novel/A-Couple-Of-Cuckoos.html',
        title: 'A Couple Of Cuckoos',
    },
    /* chapter url is random
    child: {
        id: '',
        title: 'Capítulo 339',
    },
    entry: {
        index: 1,
        size: 186_348,
        type: 'image/webp'
    }*/
}).AssertWebsite();