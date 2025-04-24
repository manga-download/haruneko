import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'suratmanga',
        title: 'Surät Manga'
    },
    container: {
        url: 'https://suratmanga.com/manga/a-villains-will-to-survive/',
        id: '/manga/a-villains-will-to-survive/',
        title: 'A Villains Will to Survive'
    },
    child: {
        id: '/a-villains-will-to-survive-bolum-4/',
        title: 'Bölüm 4'
    },
    entry: {
        index: 0,
        size: 109_792,
        type: 'image/webp'
    }
}).AssertWebsite();