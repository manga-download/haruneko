import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'alceascan',
        title: 'Alceascan'
    },
    container: {
        url: 'https://alceascan.my.id/manga/18-year-old-spy/',
        id: '/manga/18-year-old-spy/',
        title: '18 Year Old Spy'
    },
    child: {
        id: '/18-year-old-spy-chapter-56-indonesia-terbaru/',
        title: 'Chapter 56'
    },
    entry: {
        index: 1,
        size: 299_001,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());