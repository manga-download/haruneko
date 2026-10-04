import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Classic html , unique chapter

new TestFixture({
    plugin: {
        id: 'wnacg',
        title: 'Wnacg'
    },
    container: {
        url: 'https://www.wnacg.com/photos-index-aid-201161.html',
        id: '/photos-index-aid-201161.html',
        title: '[楝蛙] つづきから (COMIC 快楽天 2021年8月号) [無修正]'
    },
    child: {
        id: '/photos-index-aid-201161.html',
        title: '[楝蛙] つづきから (COMIC 快楽天 2021年8月号) [無修正]'
    },
    entry: {
        index: 0,
        size: 288_799,
        type: 'image/jpeg'
    }
}).AssertWebsite();

//CASE: javascript reader , multiple chapters

new TestFixture({
    plugin: {
        id: 'wnacg',
        title: 'Wnacg'
    },
    container: {
        url: 'https://www.wnacg.com/photos-index-aid-389356.html',
        id: '/photos-index-aid-389356.html',
        title: '[Vchan]千娇百媚'
    },
    child: {
        id: '/photos-slide-aid-273027-sid-389356.html',
        title: '第1話 [Vchan] 千娇百媚 1（无水印、无码）'
    },
    entry: {
        index: 0,
        size: 183_390,
        type: 'image/webp'
    }
}).AssertWebsite();