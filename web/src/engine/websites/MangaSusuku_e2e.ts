import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangasusuku',
        title: 'MangaSusuku'
    },
    container: {
        url: 'https://mangasusuku.xyz/komik/strawberry-market/',
        id: '/komik/strawberry-market/',
        title: 'Strawberry Market'
    },
    child: {
        id: '/strawberry-market-chapter-12/',
        title: 'Chapter 12'
    },
    entry: {
        index: 2,
        size: 688_558,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());