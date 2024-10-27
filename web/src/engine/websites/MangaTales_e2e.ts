import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangatales',
        title: 'MangaTales'
    },
    container: {
        url: 'https://mangatales.com/mangas/546/is-this-good-or-evil',
        id: '546',
        title: 'Is This Good or Evil'
    },
    child: {
        id: '546/Is This Good or Evil/10',
        title: 'Vol.0 Ch.10 - من اين أحضرت يوجي [N99ツS]'
    },
    entry: {
        index: 1,
        size: 250_692,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();