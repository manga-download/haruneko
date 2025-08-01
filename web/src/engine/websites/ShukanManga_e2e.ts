import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'shukanmanga',
        title: 'Shukan Manga'
    },
    container: {
        url: 'https://shukanmanga.jp/work_list/detail/pirates-girl/',
        id: '/work_list/detail/pirates-girl/',
        title: '海賊×少女',
    },
    child: {
        id: 'https://r.voyager.co.jp/epm/e1_502208_11062025135423/',
        title: '第1話③'
    },
    entry: {
        index: 0,
        size: 2_707_104,
        type: 'image/png'
    }
}).AssertWebsite();