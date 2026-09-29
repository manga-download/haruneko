import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicryu',
        title: 'COMICリュウ'
    },
    container: {
        url: 'https://comic-ryu.jp/series/6d078029740cd',
        id: '/series/6d078029740cd',
        title: 'ZINGNIZE'
    },
    child: {
        id: '/episodes/db4fd6cf96e40',
        title: '第一話「高坂陣内(1)」'
    },
    entry: {
        index: 5,
        size: 1_368_994,
        type: 'image/png',
    }
}).AssertWebsite();