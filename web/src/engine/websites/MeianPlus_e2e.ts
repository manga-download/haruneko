import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'meianplus',
        title: 'Meian Plus'
    },
    container: {
        url: 'https://www.meian-plus.fr/catalogue/licence/tenpuru-tome-01/139',
        id: '139',
        title: 'TenPuru'
    },
    child: {
        id: '1061',
        title: 'Tome 01'
    },
    entry: {
        index: 1,
        size: 2_541_467,
        type: 'image/png'
    }
}).AssertWebsite();