import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'harimanga',
        title: 'HariManga'
    },
    container: {
        url: 'https://harimanga.com/manga/solo-max-level-newbie/',
        id: JSON.stringify({ post: '12521', slug: '/manga/solo-max-level-newbie/'}),
        title: 'Solo Max-Level Newbie'
    },
    child: {
        id: '/manga/solo-max-level-newbie/chapter-169/',
        title: 'Chapter 169'
    },
    entry: {
        index: 0,
        size: 484_388,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());