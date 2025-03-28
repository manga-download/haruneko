import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'holymanga',
        title: 'Holy Manga'
    },
    container: {
        url: 'https://w34.holymanga.net/manga-nano-machine.html',
        id: '/manga-nano-machine.html',
        title: 'Nano Machine'
    },
    child: {
        id: '/read-nano-machine-chapter-90.html',
        title: 'Chapter 90: Qualifications Of A Vice-Lord (4)'
    },
    entry: {
        index: 1,
        size: 267_752,
        type: 'image/jpeg'
    }
}).AssertWebsite();