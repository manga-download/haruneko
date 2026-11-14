import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'komikcast',
        title: 'Voratoon'
    },
    container: {
        url: 'https://13.voratoon.com/series/swordmasters-youngest-son',
        id: '/series/swordmasters-youngest-son',
        title: 'Swordmaster’s Youngest Son'
    },
    child: {
        id: '/series/swordmasters-youngest-son/chapter/197',
        title: 'Chapter 197'
    },
    entry: {
        index: 1,
        size: 347_696,
        type: 'image/jpeg'
    }
}).AssertWebsite();