import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'shonenmagazine',
        title: '週刊少年マガジ (Weekly Shonen Magazine & Pocket Magazine)'
    },
    container: {
        url: 'https://pocket.shonenmagazine.com/episode/14079602755285713304',
        id: '/episode/14079602755285713304',
        title: 'もののけの乱'
    },
    child: {
        id: '/episode/14079602755285713304',
        title: '【第一幕】物の怪'
    },
    entry: {
        index: 0,
        size: 2_059_071,
        type: 'image/png'
    }
}).AssertWebsite();