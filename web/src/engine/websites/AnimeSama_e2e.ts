import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'animesama',
        title: 'Anime-Sama'
    },
    container: {
        url: 'https://anime-sama.si/catalogue/alice-in-borderland/',
        id: '/catalogue/alice-in-borderland/',
        title: 'Alice in Borderland'
    },
    child: {
        id: '1',
        title: 'Chapitre 1'
    },
    entry: {
        index: 1,
        size: 1_037_175,
        type: 'image/jpeg'
    }
}).AssertWebsite();