import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhwadashraw',
        title: 'Manhwa-Raw'
    }, /* CloudFlare
    container: {
        url: 'https://manhwa-raw.com/manga/sisters-taste-raw/',
        id: '/manga/sisters-taste-raw/',
        title: `Sister's Taste`
    },
    child: {
        id: '/manga/sisters-taste-raw/chapter-8/',
        title: 'Chapter 8'
    },
    entry: {
        index: 0,
        size: 272_956,
        type: 'image/webp'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());