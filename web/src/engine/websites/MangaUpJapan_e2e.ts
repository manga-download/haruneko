import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangaupjapan',
        title: 'MangaUp (�}���K�A�b�v!)'
    },
    container: {
        url: 'https://www.manga-up.com/titles/214',
        id: '214',
        title: '��-���m���-'
    },
    child: {
        id: '39175',
        title: '��P�� �� - �@'
    },
    entry: {
        index: 0,
        size: 61_018,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();
