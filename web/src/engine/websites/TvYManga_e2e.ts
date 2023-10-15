import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tvymanga',
        title: 'Tv y Manga'
    },
    container: {
        url: 'https://tvymanga2.com/goblin-slayer-year-one/',
        id: '/goblin-slayer-year-one/',
        title: 'Goblin Slayer: Year One'
    },
    child: {
        id: '/goblin-slayer-year-one-78/',
        title: '78'
    },
    entry: {
        index: 0,
        size: 70_363,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());