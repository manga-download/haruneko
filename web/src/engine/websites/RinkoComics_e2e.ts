import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'rinkocomics',
        title: 'Rinko Comics'
    },
    container: {
        url: 'https://rinkocomics.com/comic/i-will-become-the-villains-poison-taster/',
        id: '/comic/i-will-become-the-villains-poison-taster/',
        title: 'I Will Become the Villain’s Poison Taster',
        timeout: 10_000
    },
    child: {
        id: '/chapter/i-will-become-the-villains-poison-taster-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 2,
        size: 720_804,
        type: 'image/webp'
    }
}).AssertWebsite();