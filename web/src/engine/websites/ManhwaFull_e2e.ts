import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhwafull',
        title: 'ManhwaFull'
    },
    container: {
        url: 'https://manhwanew.com/manga/im-divorcing-my-tyrant-husband/',
        id: JSON.stringify({ post: '7559', slug: '/manga/im-divorcing-my-tyrant-husband/' }),
        title: 'I\'m Divorcing My Tyrant Husband'
    },
    child: {
        id: '/manga/im-divorcing-my-tyrant-husband/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 1_173_452,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());