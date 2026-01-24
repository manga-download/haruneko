import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'jmanga',
        title: 'JManga',
    },
    container: {
        url: 'https://ww3.jmanga.us/read/からかい上手-？-の西片さん-raw/',
        id: encodeURI('/read/からかい上手-？-の西片さん-raw/'),
        title: 'からかい上手(？)の西片さん',
    },
    child: {
        id: encodeURI('/read/からかい上手-？-の西片さん/ja/chapter-1-raw/'),
        title: '章 1: 第1話',
    },
    entry: {
        index: 0,
        size: 144_913,
        type: 'image/jpeg',
    }
}).AssertWebsite();