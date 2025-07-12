import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'yushukemangas',
        title: 'Yushuke Mangas',
    },
    container: {
        url: 'https://new.yushukemangas.com/manga/Upando-sozinho',
        id: '/manga/Upando-sozinho',
        title: 'Upando sozinho',
    },
    child: {
        id: '/manga/Upando-sozinho/capitulo/10042',
        title: 'Capítulo 200',
    },
    entry: {
        index: 1,
        size: 166_807,
        type: 'image/avif',
    }
}).AssertWebsite();