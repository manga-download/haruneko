import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'anatanomotokare',
        title: 'Anata no Motokare'
    },
    container: {
        url: 'https://motokare.xyz/reader/series/nekodamari/',
        id: '/reader/series/nekodamari/',
        title: 'Nekodamari'
    },
    child: {
        id: '/reader/read/nekodamari/en/1/1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 729744,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());