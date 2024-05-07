import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangarockteam',
        title: 'Manga Rock Team'
    },
    container: {
        url: 'https://mangarockteam.com/manga/becoming-the-treasured-pet-of-five-big-shots/',
        id: JSON.stringify({ post: '7801', slug: '/manga/becoming-the-treasured-pet-of-five-big-shots/' }),
        title: 'Becoming the Treasured Pet of Five Big Shots'
    },
    child: {
        id: '/manga/becoming-the-treasured-pet-of-five-big-shots/chapter-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 270_793,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());