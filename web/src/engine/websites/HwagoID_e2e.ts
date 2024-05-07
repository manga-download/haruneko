import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hwagoid',
        title: 'HwagoID'
    },
    container: {
        url: 'https://hwago.id/komik/dreaming-freedom/',
        id: JSON.stringify({post: '1993', slug: '/komik/dreaming-freedom/' }),
        title: 'Dreaming Freedom'
    },
    child: {
        id: '/komik/dreaming-freedom/chapter-126/',
        title: 'Chapter 126'
    },
    entry: {
        index: 0,
        size: 690_350,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());