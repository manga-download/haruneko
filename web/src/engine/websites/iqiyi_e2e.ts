import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'iqiyi',
        title: 'iqiyi'
    },
    container: {
        url: 'https://manhua.iqiyi.com/comic/reader?comicId=243860070&episodeId=&from=',
        id: '243860070',
        title: '苍穹榜之圣灵纪',
    },
    child: {
        id: '1007800170',
        title: '第1话：灵路榜（上）',
    },
    entry: {
        index: 2,
        size: 327_902,
        type: 'image/webp'
    }
}).AssertWebsite();