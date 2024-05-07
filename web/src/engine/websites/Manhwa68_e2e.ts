import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhwa68',
        title: 'Manhwa68'
    },
    container: {
        url: 'https://manhwa68.com/manga/bite-marks-and-fluorite/',
        id: JSON.stringify({ post: '8423', slug: '/manga/bite-marks-and-fluorite/' }),
        title: 'Bite Marks And Fluorite'
    },
    child: {
        id: '/manga/bite-marks-and-fluorite/chapter-3/',
        title: 'Chapter 3'
    },
    entry: {
        index: 0,
        size: 298_152,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());