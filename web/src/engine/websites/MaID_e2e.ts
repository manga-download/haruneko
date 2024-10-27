import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'maid',
        title: 'MAID'
    },
    container: {
        url: 'https://www.maid.my.id/manga/maria-no-danzai/',
        id: '/manga/maria-no-danzai/',
        title: 'Maria no Danzai'
    },
    child: {
        id: '/maria-no-danzai-chapter-27-bahasa-indonesia/',
        title: 'Chapter 27'
    },
    entry: {
        index: 2,
        size: 212_887,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();