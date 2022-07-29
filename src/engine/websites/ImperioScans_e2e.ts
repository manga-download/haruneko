import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'imperioscans',
        title: 'Império Scans'
    },
    container: {
        url: 'https://imperioscans.com.br/manga/level-up-alone/',
        id: JSON.stringify({ post: '1959', slug: '/manga/level-up-alone/' }),
        title: 'Level Up Alone'
    },
    child: {
        id: '/manga/level-up-alone/01/',
        title: '01'
    },
    entry: {
        index: 0,
        size: 165_632,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());