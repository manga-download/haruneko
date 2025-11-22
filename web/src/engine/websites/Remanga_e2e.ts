import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'remanga',
        title: 'Remanga'
    },
    container: {
        url: 'https://remanga.org/manga/king-of-power-reincarnation/main',
        id: 'king-of-power-reincarnation',
        title: 'Реинкарнация Короля Боевых Искусств'
    },
    child: {
        id: '1819367',
        title: 'Vol.1 Ch.1'
    },
    entry: {
        index: 0,
        size: 279_740,
        type: 'image/webp'
    }
}).AssertWebsite();