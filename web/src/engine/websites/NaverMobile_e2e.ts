import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: webtoon
new TestFixture({
    plugin: {
        id: 'navermobile',
        title: '네이버 웹툰 (Naver Webtoon Mobile)',
    },
    container: {
        url: 'https://m.comic.naver.com/webtoon/list?titleId=169080',
        id: '/webtoon/list?titleId=169080',
        title: 'Penguin loves Mev'
    },
    child: {
        id: '/webtoon/detail?titleId=169080&no=21',
        title: '20화 어린친구들'
    },
    entry: {
        index: 0,
        size: 62_101,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: challenge
new TestFixture({
    plugin: {
        id: 'navermobile',
        title: '네이버 웹툰 (Naver Webtoon Mobile)',
    },
    container: {
        url: 'https://m.comic.naver.com/challenge/list?titleId=310829',
        id: '/challenge/list?titleId=310829',
        title: 'LOVE, LOVE, LOVE !'
    },
    child: {
        id: '/challenge/detail?titleId=310829&no=1',
        title: 'INTRO'
    },
    entry: {
        index: 0,
        size: 69_206,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: bestChallenge
new TestFixture({
    plugin: {
        id: 'navermobile',
        title: '네이버 웹툰 (Naver Webtoon Mobile)',
    },
    container: {
        url: 'https://m.comic.naver.com/bestChallenge/list?titleId=499692',
        id: '/bestChallenge/list?titleId=499692',
        title: 'Twins Love Story (트윈스 러브 스토리)'
    },
    child: {
        id: '/bestChallenge/detail?titleId=499692&no=3',
        title: '2화 같은 반'
    },
    entry: {
        index: 0,
        size: 69_347,
        type: 'image/jpeg'
    }
}).AssertWebsite();