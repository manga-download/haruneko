import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lectorjpg',
        title: 'LectorJPG'
    },
    container: {
        url: 'https://lectorjpg.com/ver/una-bestia-al-anochecer',
        id: '/ver/una-bestia-al-anochecer',
        title: 'Una bestia al anochecer'
    },
    child: {
        id: '/ver/una-bestia-al-anochecer/captulo-35',
        title: 'Capítulo 35'
    },
    entry: {
        index: 0,
        size: 611_994,
        type: 'image/webp'
    }
}).AssertWebsite();