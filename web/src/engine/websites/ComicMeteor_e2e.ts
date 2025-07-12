import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicmeteor',
        title: 'COMICメテオ (COMIC Meteor)'
    },
    container: {
        url: 'https://comic-meteor.jp/isekaiseihukuki/',
        id: '/isekaiseihukuki/',
        title: '異世界征服記～不遇種族たちの最強国家～'
    },
    child: {
        id: '/ptdata/isekaiseihukuki/0001/',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 3_860_271,
        type: 'image/png'
    }
}).AssertWebsite();