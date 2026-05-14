import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'insanosmanhua',
        title: 'Insanos Manhua',
    },
    container: {
        url: 'https://insanoslibrary.com/manga/sere-rey-en-esta-vida-usare-el-dinero-para-subir-de-nivel/',
        id: '/manga/sere-rey-en-esta-vida-usare-el-dinero-para-subir-de-nivel/',
        title: 'Seré Rey En Esta Vida, Usare El Dinero Para Subir De Nivel',
        timeout: 20_000,
    },
    child: {
        id: '/manga/sere-rey-en-esta-vida-usare-el-dinero-para-subir-de-nivel/sere-rey-en-esta-vida-usare-el-dinero-para-subir-de-nivel-capitulo-184/',
        title: 'Cap. 184'
    },
    entry: {
        index: 0,
        size: 554_024,
        type: 'image/webp'
    }
}).AssertWebsite();