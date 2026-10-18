import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'orckumangas',
        title: 'OrckuMangas'
    },
    container: {
        url: 'https://orckumangas.com/ficha?id=227',
        id: '/ficha?id=227',
        title: 'No me acostaré contigo gratis'
    },
    child: {
        id: '/capitulo?id=8281',
        title: 'Cap. 1'
    },
    entry: {
        index: 1,
        size: 176_902,
        type: 'image/webp'
    }
}).AssertWebsite();