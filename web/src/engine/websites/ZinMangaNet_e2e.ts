import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'zinmanganet',
        title: 'ZinManga(.net)'
    },
    container: {
        url: 'https://zinmanga.net/manga/meet-in-the-middle/',
        id: JSON.stringify({ post: '47362', slug: '/manga/meet-in-the-middle/' }),
        title: 'Meet in The Middle'
    },
    child: {
        id: '/manga/meet-in-the-middle/chapter-50/',
        title: 'Chapter 50'
    },
    entry: {
        index: 0,
        size: 485_720,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());