import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'sekaikomik',
        title: 'ManhwaLand (SekaiKomik)',
    },
    container: {
        url: 'https://05c.manhwaland.land/manga/circles',
        id: 'circles',
        title: 'Circles'
    },
    child: {
        id: '1',
        title: 'Ch. 1',
    },
    entry: {
        index: 1,
        size: 115_840,
        type: 'image/webp'
    }
}).AssertWebsite();