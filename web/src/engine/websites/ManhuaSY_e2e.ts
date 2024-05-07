import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuasy',
        title: 'Manhua SY'
    },
    container: {
        url: 'https://www.manhuasy.com/manhua/sweet-love-variety/',
        id: JSON.stringify({ post: '9982', slug: '/manhua/sweet-love-variety/' }),
        title: 'Sweet Love Variety'
    },
    child: {
        id: '/manhua/sweet-love-variety/chapter-29-i-hve-strong-wist/',
        title: 'Chapter 29-I H@ve Strong W@ist',
    },
    entry: {
        index: 0,
        size: 108_201,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());