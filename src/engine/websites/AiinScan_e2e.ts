import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'aiinscan',
        title: 'Aiin Scan'
    },
    container: {
        url: 'https://aiinscan.xyz/manga/i-have-a-dragon-in-my-body/',
        id: JSON.stringify({ post: '635', slug: '/manga/i-have-a-dragon-in-my-body/' }),
        title: 'I Have a Dragon in My Body'
    },
    child: {
        id: '/manga/i-have-a-dragon-in-my-body/capitulo-200/',
        title: 'Capítulo 200'
    },
    entry: {
        index: 0,
        size: 2166982,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(config.plugin.title, () => fixture.AssertWebsite());