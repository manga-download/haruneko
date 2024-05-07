import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'sweettimescan',
        title: 'Sweet Time Scan'
    },
    container: {
        url: 'https://sweetscan.net/manga/the-monster-duchess-and-contract-princess/',
        id: JSON.stringify({ post: "44", slug: "/manga/the-monster-duchess-and-contract-princess/"}),
        title: 'The Monster Duchess and Contract Princess'
    },
    child: {
        id: '/manga/the-monster-duchess-and-contract-princess/1/',
        title: '1 - Capítulo 1'
    },
    entry: {
        index: 1,
        size: 913_896,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());