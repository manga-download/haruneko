import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
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
        size: 3_858_581,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();