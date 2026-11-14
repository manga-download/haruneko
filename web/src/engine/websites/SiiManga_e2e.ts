import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'siimanga',
        title: 'SiiManga'
    },
    container: {
        url: 'https://siikomik.com/komik/tears-on-a-withered-flower/',
        id: 'tears-on-a-withered-flower',
        title: 'Tears on a Withered Flower'
    },
    child: {
        id: 'chapter-86',
        title: 'Chapter 86'
    },
    entry: {
        index: 0,
        size: 271_486,
        type: 'image/webp'
    }
}).AssertWebsite();