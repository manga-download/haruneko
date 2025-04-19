import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'webcomicgamma',
        title: 'WebComicGamma'
    },
    container: {
        url: 'https://webcomicgamma.takeshobo.co.jp/manga/dorukara/',
        id: '/manga/dorukara/',
        title: 'どるから'
    },
    child: {
        id: '/_files/dorukara/001/',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 1_245_398,
        type: 'image/png'
    }
}).AssertWebsite();