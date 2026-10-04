import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Magazine
new TestFixture({
    plugin: {
        id: 'zebrack',
        title: 'Zebrack(ゼブラック)'
    },
    container: {
        url: 'https://zebrack-comic.shueisha.co.jp/magazine/1/detail',
        id: '/magazine/1',
        title: '週刊少年ジャンプ'
    },
    child: {
        id: 'magazine/14486',
        title: '2023年44号'
    },
    entry: {
        index: 0,
        size: 485_738,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: Gravure
new TestFixture({
    plugin: {
        id: 'zebrack',
        title: 'Zebrack(ゼブラック)'
    },
    container: {
        url: 'https://zebrack-comic.shueisha.co.jp/gravure/2188',
        id: '/gravure/2188',
        title: '馬場ふみか 「Asian Rendez-Vous」'
    },
    child: {
        id: 'gravure/2188',
        title: '馬場ふみか 「Asian Rendez-Vous」'
    },
    entry: {
        index: 0,
        size: 197_698,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: Manga (Chapter)
new TestFixture({
    plugin: {
        id: 'zebrack',
        title: 'Zebrack(ゼブラック)'
    },
    container: {
        url: 'https://zebrack-comic.shueisha.co.jp/title/5123',
        id: '/title/5123',
        title: 'アオのハコ'
    },
    child: {
        id: 'chapter/132107',
        title: '#1 千夏先輩'
    },
    entry: {
        index: 0,
        size: 88_836,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: Manga (Volume)
new TestFixture({
    plugin: {
        id: 'zebrack',
        title: 'Zebrack(ゼブラック)'
    },
    container: {
        url: 'https://zebrack-comic.shueisha.co.jp/title/46119',
        id: '/title/46119',
        title: 'テンマクキネマ'
    },
    child: {
        id: 'volume/178046',
        title: '1'
    },
    entry: {
        index: 0,
        size: 276_381,
        type: 'image/jpeg'
    }
}).AssertWebsite();