import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'powermanga',
        title: 'PowerManga'
    },
    container: {
        url: 'https://read.powermanga.org/series/one_piece/',
        id: '/series/one_piece/',
        title: 'One Piece'
    },
    child: {
        id: '/read/one_piece/en/0/919/',
        title: 'Chapter 919: The Ruins of Oden Castle'
    },
    entry: {
        index: 0,
        size: 257_769,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());