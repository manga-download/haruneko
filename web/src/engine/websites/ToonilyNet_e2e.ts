import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'toonilynet',
        title: 'Toonily.net'
    },
    container: {
        url: 'https://toonily.net/manga/tales-of-demons-and-gods/',
        id: JSON.stringify({ post: '2165', slug: '/manga/tales-of-demons-and-gods/' }),
        title: 'Tales of Demons and Gods'
    },
    child: {
        id: '/manga/tales-of-demons-and-gods/chapter-1/',
        title: 'Chapter 1 - Rebirth'
    },
    entry: {
        index: 0,
        size: 181_483,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());