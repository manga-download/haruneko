import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicryu',
        title: 'COMICリュウ'
    },
    container: {
        url: 'https://www.comic-ryu.jp/series/zingnize/',
        id: 'https://www.comic-ryu.jp/series/zingnize/',
        title: 'ZINGNIZE'
    },
    child: {
        id: 'https://www.comic-ryu.jp/2167/',
        title: '第一話「高坂甚内①」'
    },
    entry: {
        index: 0,
        size: 3_619_874,
        type: 'image/jpeg',
    }
}).AssertWebsite();

new TestFixture({
    plugin: {
        id: 'comicryu',
        title: 'COMICリュウ'
    },
    container: {
        url: 'https://unicorn.comic-ryu.jp/series/isekaichikyuukan/',
        id: 'https://unicorn.comic-ryu.jp/series/isekaichikyuukan/',
        title: '異世界⇔地球間で個人貿易してみた'
    },
    child: {
        id: 'https://unicorn.comic-ryu.jp/145/',
        title: '第１話'
    },
    entry: {
        index: 0,
        size: 172_714,
        type: 'image/jpeg',
    }
}).AssertWebsite();