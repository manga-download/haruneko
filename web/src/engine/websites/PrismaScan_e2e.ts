import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'prismascans',
        title: 'Prisma Scan'
    },
    container: {
        url: 'https://prismascans.net/manga/sovereign04/',
        id: JSON.stringify({ post: '254', slug: '/manga/sovereign04/' }),
        title: 'O Antigo Soberano da Eternidade'
    },
    child: {
        id: '/manga/sovereign04/cap-01/',
        title: 'CAP. 01'
    },
    entry: {
        index: 1,
        size: 2_037_078,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());