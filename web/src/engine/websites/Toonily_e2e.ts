import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'toonily',
        title: 'Toonily'
    },
    container: {
        url: 'https://toonily.com/webtoon/leviathan-0002/',
        id: JSON.stringify({ post: '1892', slug: '/webtoon/leviathan-0002/' }),
        title: 'Leviathan'
    },
    child: {
        id: '/webtoon/leviathan-0002/chapter-0/',
        title: 'Chapter 0 - Prologue'
    },
    entry: {
        index: 0,
        size: 1_091_504,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());