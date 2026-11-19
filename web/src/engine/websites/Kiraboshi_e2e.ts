import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kiraboshi',
        title: 'Kiraboshi'
    },
    container: {
        url: 'https://kirapo.jp/meteor/titles/mashirochan',
        id: '/meteor/titles/mashirochan',
        title: '嘘彼氏でもいいからとにかくシたいましろちゃん'
    },
    child: {
        id: '/pt/meteor/mashirochan/1020849/viewer',
        title: '第1話＆第2話'
    },
    entry: {
        index: 1,
        size: 1_167_536,
        type: 'image/png'
    }
}).AssertWebsite();