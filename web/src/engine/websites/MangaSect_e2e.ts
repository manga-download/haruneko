import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangasect',
        title: 'MangaSect'
    },
    container: {
        url: 'https://mangasect.net/manga/eternal-club',
        id: '/manga/eternal-club',
        title: 'Eternal Club'
    },
    child: {
        id: '/manga/eternal-club/chapter-274',
        title: 'Chapter 274'
    },
    entry: {
        index: 0,
        size: 897_274,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());