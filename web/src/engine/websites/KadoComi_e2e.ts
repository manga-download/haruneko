import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
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
        id: '018d6c44-a85b-750b-bda1-b23582d67441',
        title: '第2話'
    },
    entry: {
        index: 0,
        size: 130_134,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());