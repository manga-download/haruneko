import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaid',
        title: 'MangaID'
    },
    container: {
        url: 'https://mangaid.click/manga/1nen-agumi-no-monster',
        id: '/manga/1nen-agumi-no-monster',
        title: '1-nen A-gumi no Monster'
    },
    child: {
        id: '/manga/1nen-agumi-no-monster/56',
        title: 'Chapter 56'
    },
    entry: {
        index: 1,
        size: 236_228,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());