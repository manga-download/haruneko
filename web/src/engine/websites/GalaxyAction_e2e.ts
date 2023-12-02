import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'galaxyaction',
        title: 'Galaxy Action'
    },
    container: {
        url: 'https://galaxyaction.site/manga/eternal-club/',
        id: '/manga/eternal-club/',
        title: 'Eternal Club'
    },
    child: {
        id: '/eternal-club-chapter-01/',
        title: 'الفصل 01'
    },
    entry: {
        index: 1,
        size: 747_168,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());