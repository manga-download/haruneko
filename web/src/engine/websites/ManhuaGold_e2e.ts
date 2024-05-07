import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuagold',
        title: 'Manhua Gold'
    },
    container: {
        url: 'https://comickiba.com/manga/isekai-kenkokuki/',
        id: JSON.stringify({ post: '13858', slug: '/manga/isekai-kenkokuki/' }),
        title: 'Isekai Kenkokuki'
    },
    child: {
        id: '/manga/isekai-kenkokuki/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 139_550,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());