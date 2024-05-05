import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hachirumi',
        title: 'Hachirumi'
    },
    container: {
        url: 'https://hachirumi.com/read/manga/earth-recording-0001/',
        id: 'earth-recording-0001',
        title: 'Earth Recording 0001'
    },
    child: {
        id: '4',
        title: 'Chapter 4 - Oneshot (Final improved version) (Higher-resolution version) (2/2)'
    },
    entry: {
        index: 0,
        size: 2_480_679,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());