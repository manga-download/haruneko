import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'webdexscans',
        title: 'WebDex Scans'
    },
    container: {
        url: 'https://webdexscans.com/series/the-lone-sss-rank-summoner/',
        id: JSON.stringify({ post: '2010', slug: '/series/the-lone-sss-rank-summoner/' }),
        title: 'The Lone SSS-Rank Summoner'
    },
    child: {
        id: '/series/the-lone-sss-rank-summoner/chapter-100/',
        title: 'Chapter 100'
    },
    entry: {
        index: 0,
        size: 448_368,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());