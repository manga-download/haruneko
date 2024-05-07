import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhwatop',
        title: 'ManhwaTop'
    },
    container: {
        url: 'https://manhwatop.com/manga/i-gave-birth-to-a-murderers-child-series/',
        id: JSON.stringify({ post: '26544', slug: '/manga/i-gave-birth-to-a-murderers-child-series/' }),
        title: 'I Gave Birth To A Murderer’s Child'
    },
    child: {
        id: '/manga/i-gave-birth-to-a-murderers-child-series/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 87_910,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());