import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhwafullnet',
        title: 'ManhwaFull(.net)',
    },
    container: {
        url: 'https://manhwafull.net/manga-dance-dance-danseur.html',
        id: '/manga-dance-dance-danseur.html',
        title: 'Dance Dance Danseur'
    },
    child: {
        id: '/read-dance-dance-danseur-chapter-155.html',
        title: 'Vol.17 Chapter 155'
    },
    entry: {
        index: 0,
        size: 183_322,
        type: 'image/jpeg'
    }
}).AssertWebsite();