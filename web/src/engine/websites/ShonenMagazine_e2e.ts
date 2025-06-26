import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'shonenmagazine',
        title: '週刊少年マガジ (Weekly Shonen Magazine & Pocket Magazine)'
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
        index: 0,
        size: 2_015_478,
        type: 'image/png'
    }
}).AssertWebsite();

new TestFixture({
    plugin: {
        id: 'shonenmagazine',
        title: '週刊少年マガジ (Weekly Shonen Magazine & Pocket Magazine)'
    },
    container: {
        url: 'https://pocket.shonenmagazine.com/title/00553/episode/209248',
        id: '553',
        title: '頭文字D'
    },
    child: {
        id: '209248',
        title: '【Vol.1】ハチロク買おーぜ'
    },
    entry: {
        index: 0,
        size: 760_906,
        type: 'image/png'
    }
}).AssertWebsite();