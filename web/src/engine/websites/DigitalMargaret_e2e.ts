import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'digitalmargaret',
        title: 'デジタルマーガレット (Digital Margaret)'
    },
    container: {
        url: 'https://digitalmargaret.jp/detail/seijyokankin/',
        id: '/detail/seijyokankin/',
        title: '私、聖女。いま、監禁されているの'
    },
    child: {
        id: '/contents/seijyokankin/231001_1-17f812664eb968b5aab01e76f7c2a6335/',
        title: '第1-1話'
    },
    entry: {
        index: 0,
        size: 1_317_928,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();