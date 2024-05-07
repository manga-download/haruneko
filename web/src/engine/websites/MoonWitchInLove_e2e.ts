import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'moonwitchinlove',
        title: 'Moon Witch In Love'
    },
    container: {
        url: 'https://moonwitchinlovescan.com/manga/lq/',
        id: JSON.stringify({ post: '59', slug: '/manga/lq/' }),
        title: 'Lady to Queen'
    },
    child: {
        id: '/manga/lq/capitulo-01/',
        title: 'Capítulo 01'
    },
    entry: {
        index: 0,
        size: 383_596,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());