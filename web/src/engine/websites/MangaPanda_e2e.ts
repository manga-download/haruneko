import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangapanda',
        title: 'MangaPanda'
    },
    container: {
        url: 'https://www.mangapanda.in/manga/theres-no-hope-for-winter',
        id: '/manga/theres-no-hope-for-winter',
        title: `There’s No Hope for Winter`
    },
    child: {
        id: '/theres-no-hope-for-winter-chapter-79',
        title: 'Chapter 79',
    },
    entry: {
        index: 0,
        size: 120_950,
        type: 'image/webp',
    }
}).AssertWebsite();