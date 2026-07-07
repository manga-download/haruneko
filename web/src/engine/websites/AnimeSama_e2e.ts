import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'animesama',
        title: 'Anime-Sama'
    },
    container: {
        url: 'https://anime-sama.to/catalogue/alice-in-borderland/',
        id: '/catalogue/alice-in-borderland/',
        title: 'Alice in Borderland'
    },
    child: {
        id: '1',
        title: 'Chapitre 1'
    },
    entry: {
        index: 1,
        size: 927_539,
        type: 'image/jpeg'
    }
}).AssertWebsite();