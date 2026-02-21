import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'galaxymanga',
        title: 'Galaxy Manga'
    },
    container: {
        url: 'https://galaxymanga.io/manga/you-awakened-while-i-was-dead/',
        id: '/manga/you-awakened-while-i-was-dead/',
        title: 'You Awakened while I Was Dead'
    },
    child: {
        id: '/you-awakened-while-i-was-dead-chapter-73/',
        title: 'Chapter 73'
    },
    entry: {
        index: 0,
        size: 119_984,
        type: 'image/webp'
    }
}).AssertWebsite();