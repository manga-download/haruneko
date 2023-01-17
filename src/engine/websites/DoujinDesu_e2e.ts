import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'doujindesu',
        title: 'DoujinDesu'
    },
    container: {
        url: 'https://212.32.226.234/manga/hero-villain/',
        id: '/manga/hero-villain/',
        title: 'Hero Villain'
    },
    child: {
        id: '/2022/02/19/hero-villain-chapter-01/',
        title: 'Hero Villain Chapter 01'
    },
    entry: {
        index: 1,
        size: 1_115_560,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());