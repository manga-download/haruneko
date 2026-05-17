import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kadocomi',
        title: 'カドコミ (KadoComi)'
    },
    container: {
        url: 'https://comic-walker.com/detail/KC_001050_S',
        id: 'KC_001050_S',
        title: 'いつかのLo-fiみゅーじっく'
    },
    child: {
        id: JSON.stringify({ id: '018d6c44-a85b-750b-bda1-b23582d67441', code: 'KC_0010500000200011_E' }),
        title: '第2話'
    },
    entry: {
        index: 0,
        size: 130_134,
        type: 'image/webp'
    }
}).AssertWebsite();