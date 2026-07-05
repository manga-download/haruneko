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
        id: '/todays-han-yoil-is-a-woman-chapter-01/',
        title: 'Ch. 1'
    },
    entry: {
        index: 0,
        size: 325_211,
        type: 'image/jpeg'
    }
}).AssertWebsite();