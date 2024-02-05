import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'stellarsaber',
        title: 'Stellar Saber'
    },
    container: {
        url: 'https://stellarsaber.com/manga/jujutsu-kaisen/',
        id: JSON.stringify({ post: '2054', slug: '/manga/jujutsu-kaisen/'}),
        title: 'Jujutsu Kaisen'
    },
    child: {
        id: '/manga/jujutsu-kaisen/-249/',
        title: 'الفصل 249'
    },
    entry: {
        index: 0,
        size: 2_866_377,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());