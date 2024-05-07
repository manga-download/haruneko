import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'lynxscans',
        title: 'Lynx Scans'
    },
    container: {
        url: 'https://lynxscans.com/comics/the-story-of-a-low-rank-soldier-becoming-a-monarch/',
        id: '/comics/the-story-of-a-low-rank-soldier-becoming-a-monarch/',
        title: 'The Story of a Low-Rank Soldier Becoming a Monarch'
    },
    child: {
        id: '/the-story-of-a-low-rank-soldier-becoming-a-monarch-chapter-1/',
        title: 'Chapter 1',
        timeout: 15000
    },
    entry: {
        index: 1,
        size: 331_985,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());