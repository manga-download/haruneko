import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'komikindo',
        title: 'KomikIndo'
    },
    container: {
        url: 'https://komiksin.id/manga/please-go-home-akutsu-san/',
        id: '/manga/please-go-home-akutsu-san/',
        title: 'Please Go Home, Akutsu-san!'
    },
    child: {
        id: '/please-go-home-akutsu-san-chapter-1/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 4_107_459,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();