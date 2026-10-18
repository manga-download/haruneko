import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'dragontranslation',
        title: 'DragonTranslation'
    },
    container: {
        url: 'https://dragontranslation.org/manga/sakamto-d4ys/',
        id: '/manga/sakamto-d4ys/',
        title: 'Sakamoto Days'
    },
    child: {
        id: '/manga/sakamto-d4ys/capitulo-1-el-legendario-sicario/',
        title: 'Capitulo 1: El legendario sicario'
    },
    entry: {
        index: 1,
        size: 289_730,
        type: 'image/jpeg'
    }
}).AssertWebsite();