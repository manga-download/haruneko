import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comickfan',
        title: 'Comick Fanmade',
    },
    container: {
        url: 'https://comickfan.com/manga/hello-veterinarian',
        id: '/manga/hello-veterinarian',
        title: 'Hello! Veterinarian!',
    },
    child: {
        id: '/manga/hello-veterinarian/chapter-122-fjtlOAQVKQ',
        title: 'Chapter 122 [Mangakakalot]',
    },
    entry: {
        index: 1,
        size: 67_830,
        type: 'image/webp',
    }
}).AssertWebsite();