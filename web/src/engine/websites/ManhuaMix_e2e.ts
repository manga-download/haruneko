import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuamix',
        title: 'Manhua Mix'
    },
    container: {
        url: 'https://manhuamix.com/manhua/the-knight-king-who-returned-with-a-god/',
        id: JSON.stringify({ post: '2951', slug: '/manhua/the-knight-king-who-returned-with-a-god/' }),
        title: 'The Knight King Who Returned with a God'
    },
    child: {
        id: '/manhua/the-knight-king-who-returned-with-a-god/knight-king-who-returned-with-a-god-chapter-1/',
        title: 'Knight King Who Returned with a God chapter 1'
    },
    entry: {
        index: 0,
        size: 686_261,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());