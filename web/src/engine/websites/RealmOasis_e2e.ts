import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'realmoasis',
        title: 'Realm Oasis'
    },
    container: {
        url: 'https://realmoasis.com/684173841120087/7py6s29l863525l7tlf7rxy1sz',
        id: '/684173841120087/7py6s29l863525l7tlf7rxy1szn',
        title: 'Demonic Master of Mount Kunlun'
    },
    child: {
        id: '/684173841120087/5655ccdeb635253e0707217846fd',
        title: 'Chapter 49'
    },
    entry: {
        index: 0,
        size: 155_262,
        type: 'image/webp'
    }
}).AssertWebsite();