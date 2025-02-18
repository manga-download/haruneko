import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangaupjapan',
        title: 'MangaUp (ƒ}ƒ“ƒKƒAƒbƒv!)'
    },
    container: {
        url: 'https://www.manga-up.com/titles/214',
        id: '214',
        title: 'ç-ˆ¢’m‰ê•Ò-'
    },
    child: {
        id: '39175',
        title: '‘æ‚P‹Ç ç®ç - ‡@'
    },
    entry: {
        index: 0,
        size: 61_018,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();
