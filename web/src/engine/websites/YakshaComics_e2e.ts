import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'yakshacomics',
        title: 'Yaksha Comics'
    },
    container: {
        url: 'https://yakshacomics.com/manga/hey-mr-perfect-your-flawless-image-just-collapsed/',
        id: JSON.stringify({ post: '315', slug: '/manga/hey-mr-perfect-your-flawless-image-just-collapsed/' }),
        title: 'Hey, Mr. Perfect, Your Flawless Image Just Collapsed'
    },
    child: {
        id: '/manga/hey-mr-perfect-your-flawless-image-just-collapsed/',
        title: 'Chapter 28'
    },
    entry: {
        index: 2,
        size: 551_562,
        type: 'image/webp',
    }
}).AssertWebsite();