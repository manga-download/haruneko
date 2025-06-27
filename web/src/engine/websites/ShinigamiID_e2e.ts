import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'shinigamiid',
        title: 'Shinigami ID',
    },
    container: {
        url: 'https://04.shinigami.asia/series/sss-class-suicide-hunter/',
        id: JSON.stringify({ post: '641', slug: '/series/sss-class-suicide-hunter/' }),
        title: 'SSS-Class Suicide Hunter'
    },
    child: {
        id: '/series/sss-class-suicide-hunter/chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 1,
        size: 894_830,
        type: 'image/jpeg'
    }
}).AssertWebsite();