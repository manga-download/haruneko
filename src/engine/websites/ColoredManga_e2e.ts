import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'coloredmanga',
        title: 'Colored Manga'
    },
    container: {
        url: 'https://coloredmanga.com/manga/E49xjKSeqY2PQybGGc4bEyiIuoMq0t28QWg9PFHbRnALhebZqq',
        id: 'E49xjKSeqY2PQybGGc4bEyiIuoMq0t28QWg9PFHbRnALhebZqq',
        title: 'Demon Slayer꞉ Kimetsu no Yaiba'
    },
    child: {
        id: 'Au9tJVeFvcYsYqu8vW9ty0AoZmGOzX',
        title: 'Chapter 001'
    },
    entry: {
        index: 1,
        size: 831_325,
        type: 'image/jpeg'
    }
}).AssertWebsite();
