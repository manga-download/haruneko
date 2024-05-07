import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuass',
        title: 'Manhuas-S'
    },
    container: {
        url: 'https://manhuauss.com/manga/the-man-who-devoured-the-light/',
        id: JSON.stringify({ post: '2799', slug: '/manga/the-man-who-devoured-the-light/' }),
        title: 'The Man Who Devoured The Light'
    },
    child: {
        id: '/manga/the-man-who-devoured-the-light/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 561_028,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());