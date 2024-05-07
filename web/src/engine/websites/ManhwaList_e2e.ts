import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhwalist',
        title: 'Manhwa List'
    },
    container: {
        url: 'https://manhwalist.com/manga/lookism/',
        id: '/manga/lookism/',
        title: 'Lookism'
    },
    child: {
        id: '/lookism-chapter-478-indonesia-terbaru/',
        title: 'Chapter 478'
    },
    entry: {
        index: 0,
        size: 95_488,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());