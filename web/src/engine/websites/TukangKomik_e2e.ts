import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'tukangkomik',
        title: 'TukangKomik'
    },
    container: {
        url: 'https://tukangkomik.co/manga/nano-list/',
        id: '/manga/nano-list/',
        title: 'Nano List',
    },
    child: {
        id: '/nano-list-chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 3,
        size: 38_047,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();