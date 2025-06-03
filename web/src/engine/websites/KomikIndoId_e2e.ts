import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'komikindoid',
        title: 'KomikIndoId'
    },
    container: {
        url: 'https://komikindo.rip/komik/50kg-cinderella/',
        id: '/komik/50kg-cinderella/',
        title: '-50kg Cinderella'
    },
    child: {
        id: '/50kg-cinderella-chapter-1-1/',
        title: 'Chapter 1.1'
    },
    entry: {
        index: 2,
        size: 57_750,
        type: 'image/jpeg'
    }
}).AssertWebsite();