import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Plain Images
new TestFixture({
    plugin: {
        id: '18comic',
        title: '18comic'
    },
    container: {
        url: 'https://18comic.vip/album/286/',
        id: '/album/286/',
        title: '[沒有漢化][ゲズンタイト]HARWEST(COMIC クリベロン 2018年2月号 Vol.64)',
    },
    child: {
        id: '/photo/286/',
        title: '[沒有漢化][ゲズンタイト]HARWEST(COMIC クリベロン 2018年2月号 Vol.64)'
    },
    entry: {
        index: 0,
        size: 188_690,
        type: 'image/webp'
    }
}).AssertWebsite();

// CASE: Scrambled Images
new TestFixture({
    plugin: {
        id: '18comic',
        title: '18comic'
    },
    container: {
        url: 'https://18comic.vip/album/557769/',
        id: '/album/557769/',
        title: '上流社會～我要成為人生勝利組～ [禁漫漢化組]',
    },
    child: {
        id: '/photo/557769',
        title: '第1话 上流社會～我要成為人生勝利組～',
        timeout: 10_000
    },
    entry: {
        index: 0,
        size: 78_826, //60_850
        type: 'image/png'
    }
}).AssertWebsite();