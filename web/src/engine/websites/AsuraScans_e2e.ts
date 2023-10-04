import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'asurascans',
        title: 'Asura Scans',
    },
    container: {
        url: 'https://asuratoon.com/manga/3787011421-dragon-devouring-mage/',
        id: '/manga/3787011421-dragon-devouring-mage/',
        title: 'Dragon-Devouring Mage',
    },
    child: {
        id: '/5337927378-dragon-devouring-mage-1/',
        title: 'Chapter 1',
    },
    entry: {
        index: 1,
        size: 4_377_432,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());