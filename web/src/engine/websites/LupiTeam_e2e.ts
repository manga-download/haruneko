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
        id: '/read/one-piece/it/vol/107/ch/1086',
        title: '[Deluxe] Vol.107 Ch.1086 - I Cinque Astri di Saggezza'
    },
    entry: {
        index: 1,
        size: 377_382,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());