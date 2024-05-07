import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'yaoiscan',
        title: 'YaoiScan'
    },
    container: {
        url: 'https://yaoiscan.com/read/the-crows-prince/',
        id: JSON.stringify({ post: '13379', slug: '/read/the-crows-prince/' }),
        title: 'The Crow\'s Prince'
    },
    child: {
        id: '/read/the-crows-prince/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 135_160,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());