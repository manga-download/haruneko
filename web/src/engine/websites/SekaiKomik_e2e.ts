import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'sekaikomik',
        title: 'ManhwaLand (SekaiKomik)',
        timeout: 30_000
    },
    container: {
        url: 'https://manhwaland.work/komik/circles',
        id: 'circles',
        title: 'Circles'
    },
    child: {
        id: '1',
        title: 'Chapter 1',
        timeout: 15000
    },
    entry: {
        index: 1,
        size: 112_780,
        type: 'image/webp'
    }
}).AssertWebsite();