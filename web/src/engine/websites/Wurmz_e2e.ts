import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'wurmz',
        title: 'Wurmz'
    },
    container: {
        url: 'https://wurmz.net/detail/manhwa/aku-dibesarkan-oleh-penjahat',
        id: '/detail/manhwa/aku-dibesarkan-oleh-penjahat',
        title: `I've Been Raised By Villains`
    },
    child: {
        id: '/detail/manhwa/aku-dibesarkan-oleh-penjahat/chapter/1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 325_211,
        type: 'image/jpeg'
    }
}).AssertWebsite();