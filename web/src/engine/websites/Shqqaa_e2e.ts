import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'shqqaa',
        title: 'موقع شقاع (Shqqaa)'
    },
    container: {
        url: 'https://www.shqqaa.com/manga/one-piece/',
        id: '/manga/one-piece/',
        title: 'One Piece'
    },
    child: {
        id: '/manga/one-piece/967',
        title: '967'
    },
    entry: {
        index: 0,
        size: 423_077,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());