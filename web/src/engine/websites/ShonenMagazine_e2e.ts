import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: ???
new TestFixture({

    plugin: {
        id: 'shonenmagazine',
        title: '週刊少年マガジ (Weekly Shonen Magazine & Pocket Magazine)',
    },
    container: {
        url: 'https://pocket.shonenmagazine.com/title/02373/episode/3861164',
        id: '2373',
        title: 'もののけの乱'
    },
    child: {
        id: '386116',
        title: '【第一幕】物の怪'
    },
    entry: {
        index: 3,
        size: 106_611,
        type: 'image/png'
    }
}).AssertWebsite();

// CASE: ???
new TestFixture({
    plugin: {
        id: 'shonenmagazine',
        title: '週刊少年マガジ (Weekly Shonen Magazine & Pocket Magazine)',

    },
    container: {
        url: 'https://pocket.shonenmagazine.com/title/00553/episode/209248',
        id: '553',
        title: '頭文字D',
        timeout: 15_000
    },
    child: {
        id: '209248',
        title: '【Vol.1】ハチロク買おーぜ',
    },
    entry: {
        index: 7,
        size: 198_634,
        type: 'image/png',
    }
}).AssertWebsite();