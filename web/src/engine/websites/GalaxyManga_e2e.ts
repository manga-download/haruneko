import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'galaxymanga',
        title: 'Galaxy Manga'
    },
    container: {
        url: 'https://flixscans.com/series/55601-101-betrayal-of-dignity',
        id: '101',
        title: 'Betrayal of Dignity'
    },
    child: {
        id: '13351',
        title: '40'
    },
    entry: {
        index: 0,
        size: 341_024,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());