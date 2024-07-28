import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'lupiteam',
        title: 'LupiTeam'
    },
    container: {
        url: 'https://lupiteam.net/comics/one-piece',
        id: 'one-piece',
        title: 'One Piece'
    },
    child: {
        id: '/read/one-piece/it/vol/110/ch/1121',
        title: '[Deluxe] Vol.110 Ch.1121 - Il fluire del tempo'
    },
    entry: {
        index: 1,
        size: 365_372,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());