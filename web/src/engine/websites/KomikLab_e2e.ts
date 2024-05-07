import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'komiklab',
        title: 'KomikLab (English)'
    },
    container: {
        url: 'https://komiklab.com/manga/the-strongest-harem-of-nobles/',
        id: '/manga/the-strongest-harem-of-nobles/',
        title: 'The Strongest Harem of Nobles'
    },
    child: {
        id: '/the-strongest-harem-of-nobles-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 203_717,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());