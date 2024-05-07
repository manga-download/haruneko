import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'nvmanga',
        title: 'NvManga'
    },
    container: {
        url: 'https://nvmanga.com/webtoon/real-world-mobile/',
        id: JSON.stringify({ post: '14569', slug: '/webtoon/real-world-mobile/' }),
        title: 'Real World Mobile'
    },
    child: {
        id: '/webtoon/real-world-mobile/chapter-54/',
        title: 'Chapter 54'
    },
    entry: {
        index: 0,
        size: 53_614,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());