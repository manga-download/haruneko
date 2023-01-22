import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'yugenmangas-es',
        title: 'YugenMangas (ES)'
    },
    container: {
        url: 'https://yugenmangas.com/series/demon-king-cheat-system/',
        id: JSON.stringify({ post: '18638', slug: '/series/demon-king-cheat-system/' }),
        title: 'Demon King Cheat System'
    },
    child: {
        id: '/series/demon-king-cheat-system/capitulo/',
        title: 'Capitulo'
    },
    entry: {
        index: 0,
        size: 772_248,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());