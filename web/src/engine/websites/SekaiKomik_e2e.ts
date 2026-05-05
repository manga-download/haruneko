import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'sekaikomik',
        title: 'ManhwaLand (SekaiKomik)',
        //timeout: 30_000
    },
    container: {
        url: 'https://02x.mwland.xyz/komik/circles',
        id: 'circles',
        title: 'Circles'
    },
    child: {
        id: '/baca/circles/1',
        title: 'Chapter 1',
    },
    entry: {
        index: 1,
        size: 115_840,
        type: 'image/webp'
    }
}).AssertWebsite();