import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'michikusa',
        title: 'MichiKusa'
    },
    container: {
        url: 'https://michikusacomics.jp/product/myfirstblue',
        id: '/product/myfirstblue',
        title: 'きらきら、あおい',
    },
    child: {
        id: '/wp-content/uploads/data/20_myfirstblue/01/',
        title: 'Ep.1',
    },
    entry: {
        index: 0,
        size: 2_245_849,
        type: 'image/png'
    }
}).AssertWebsite();