import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'zeurelscan',
        title: 'ZeurelScan'
    },
    container: {
        url: 'https://www.zeurelscan.com/serie/administrator-kang-jin-lee',
        id: '/serie/administrator-kang-jin-lee',
        title: 'Administrator - Kang Jin Lee'
    },
    child: {
        id: '/read/administrator-kang-jin-lee/79',
        title: '#079'
    },
    entry: {
        index: 1,
        size: 252_568,
        type: 'image/jpeg'
    }
}).AssertWebsite();