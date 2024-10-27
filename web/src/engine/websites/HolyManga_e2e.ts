import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'holymanga',
        title: 'Holy Manga'
    },
    container: {
        url: 'https://w32.holymanga.net/one-piece-02/',
        id: '/one-piece-02/',
        title: 'One Piece',
        timeout: 10000
    },
    child: {
        id: '/one-piece-chapter-1096',
        title: 'Chapter 1096'
    },
    entry: {
        index: 0,
        size: 450_883,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();