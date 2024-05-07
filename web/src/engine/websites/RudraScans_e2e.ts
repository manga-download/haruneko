import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'rudrascans',
        title: 'Rudra Scans'
    },
    container: {
        url: 'https://rudrascans.com/series/e9b15101c72/',
        id: '/series/e9b15101c72/',
        title: 'The Calamity of the End Times'
    },
    child: {
        id: '/chapter/e9b15101c72-04b3ed896a1/',
        title: 'Chapter 40'
    },
    entry: {
        index: 1,
        size: 281_707,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());