import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'novamanga',
        title: 'Nova Manga'
    },
    container: {
        url: 'https://novamanga.com/series/seirei-gensouki-konna-sekai-de-deaeta-kimi-ni-minazuki-futago',
        id: '/series/seirei-gensouki-konna-sekai-de-deaeta-kimi-ni-minazuki-futago',
        title: 'Seirei Gensouki - Konna Sekai de Deaeta Kimi ni (MINAZUKI Futago)'
    },
    child: {
        id: '/read/seirei-gensouki-konna-sekai-de-deaeta-kimi-ni-minazuki-futago-chapter-56-5',
        title: 'Chapter 56.5'
    },
    entry: {
        index: 0,
        size: 674_658,
        type: 'image/webp'
    }
}).AssertWebsite();