import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'kanzenin',
        title: 'Kanzenin'
    },
    container: {
        url: 'https://kanzenin.info/manga/new-town/',
        id: '/manga/new-town/',
        title: 'New Town'
    },
    child: {
        id: '/new-town-chapter-108/',
        title: 'Chapter 108 End'
    },
    entry: {
        index: 2,
        size: 378_552,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();