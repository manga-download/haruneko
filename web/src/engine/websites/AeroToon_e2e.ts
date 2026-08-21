import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'aerotoon',
        title: 'AeroToon'
    },
    container: {
        url: 'https://aerotoon.vercel.app/seri/the-wandering-warrior-of-wudang',
        id: 'the-wandering-warrior-of-wudang',
        title: 'The Wandering Warrior of Wudang'
    },
    child: {
        id: '1533',
        title: 'Bölüm 159'
    },
    entry: {
        index: 2,
        size: 581_928,
        type: 'image/webp'
    }
}).AssertWebsite();