import { TestFixture } from '../../../test/WebsitesFixture';

// Case : episodes
new TestFixture({
    plugin: {
        id: 'comicdays',
        title: 'コミックDAYS (Comic Days)'
    },
    container: {
        url: 'https://comic-days.com/episode/14079602755285689668',
        id: '/episode/14079602755285689668',
        title: 'ＪＪＭ 女子柔道部物語 社会人編',
    },
    child: {
        id: '/episode/14079602755285689668',
        title: '第１話　かかぁ天下と空っ風'
    },
    entry: {
        index: 0,
        size: 2_259_808,
        type: 'image/png'
    }
}).AssertWebsite();

// Case : volumes
new TestFixture({
    plugin: {
        id: 'comicdays',
        title: 'コミックDAYS (Comic Days)'
    },
    container: {
        url: 'https://comic-days.com/volume/2550689798642753315',
        id: '/volume/2550689798642753315',
        title: 'ＪＪＭ 女子柔道部物語 社会人編',
    }, /* Paid content
    child: {
        id: '/volume/2550689798642753315',
        title: '（１)'
    },
    entry: {
        index: 0,
        size: -1,
        type: 'image/png'
    }*/
}).AssertWebsite();

// Case : magazines
new TestFixture({
    plugin: {
        id: 'comicdays',
        title: 'コミックDAYS (Comic Days)'
    },
    container: {
        url: 'https://comic-days.com/magazine/3269754496454823816',
        id: '/magazine/3269754496454823816',
        title: 'アフタヌーン',
    }, /* Paid content
    child: {
        id: '/magazine/3269754496454823816',
        title: '２０２２年２月号'
    }, /* Paid content
    entry: {
        index: 0,
        size: -1,
        type: 'image/png'
    }*/
}).AssertWebsite();