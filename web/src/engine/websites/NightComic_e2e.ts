import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'nightcomic',
        title: 'NIGHT COMIC'
    },
    container: {
        url: 'https://nightcomic.com/manga/the-devil-butler/',
        id: JSON.stringify({ post: '2057', slug: '/manga/the-devil-butler/' }),
        title: 'The Devil Butler'
    },
    child: {
        id: '/manga/the-devil-butler/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 132_954,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());