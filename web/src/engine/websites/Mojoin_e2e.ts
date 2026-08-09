import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mojoin',
        title: 'Mojoin',
    },
    container: {
        url: 'https://mojoin.com/comics/208#chapter',
        id: '208',
        title: '難搞的戀愛體質'
    },
    child: {
        id: '000_SP',
        title: '預告'
    },
    entry: {
        index: 0,
        size: 187_103,
        type: 'image/jpeg'
    }
}).AssertWebsite();