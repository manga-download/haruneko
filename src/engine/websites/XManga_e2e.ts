import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'xmanga',
        title: 'XManga'
    },
    container: {
        url: 'https://x-manga.org/manga/konna-elf-ni-you-wa-nai/',
        id: JSON.stringify({ post: '4237', slug: '/manga/konna-elf-ni-you-wa-nai/' }),
        title: 'Konna Elf ni You wa Nai'
    },
    child: {
        id: '/manga/konna-elf-ni-you-wa-nai/chapitre-7/',
        title: 'Chapitre 7'
    },
    entry: {
        index: 0,
        size: 613_473,
        type: 'image/jpeg'
    }
}).AssertWebsite();