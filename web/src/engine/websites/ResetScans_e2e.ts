import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'resetscans',
        title: 'Reset Scans'
    },
    container: {
        url: 'https://reset-scans.xyz/manga/book-eater',
        id: '/manga/book-eater',
        title: 'Book Eater'
    },
    child: {
        id: '/manga/book-eater/100',
        title: 'Chapter 100'
    },
    entry: {
        index: 1,
        size: 155_194,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());