import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'topmanhuanet',
        title: 'Top ManhuaNET'
    },
    container: {
        url: 'https://topmanhua.net/manga/murim-login/',
        id: JSON.stringify({ post: '2198', slug: '/manga/murim-login/' }),
        title: 'Murim Login'
    },
    child: {
        id: '/manga/murim-login/chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 1,
        size: 1_257_966,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());