import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mymangalist',
        title: 'MyMangaList'
    },
    container: {
        url: 'https://www5.mymangalist.org/t-my-hero-academia',
        id: '/t-my-hero-academia',
        title: 'My Hero Academia'
    },
    child: {
        id: '/s-my-hero-academia--chapter-430f',
        title: 'Chapter 430f'
    },
    entry: {
        index: 0,
        size: 259_599,
        type: 'image/jpeg'
    }
}).AssertWebsite();