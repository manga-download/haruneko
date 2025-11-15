import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'animesama',
        title: 'Anime-Sama'
    },
    container: {
        url: 'https://anime-sama.me/manga/sakamoto-days/',
        id: '/manga/sakamoto-days/',
        title: 'Sakamoto Days'
    },
    child: {
        id: '/sakamoto-days-chapitre-136/',
        title: 'Chapitre 136'
    },
    entry: {
        index: 0,
        size: 333_194,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();