import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhwatop',
        title: 'ManhwaTop'
    },
    container: {
        url: 'https://manhwatop.com/manga/i-gave-birth-to-a-murderers-child-series/',
        id: JSON.stringify({ post: '26544', slug: '/manga/i-gave-birth-to-a-murderers-child-series/' }),
        title: 'I Gave Birth To A Murderer’s Child'
    },
    child: {
        id: '/manga/i-gave-birth-to-a-murderers-child-series/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 1_521_931,
        type: 'image/jpeg'
    }
}).AssertWebsite();