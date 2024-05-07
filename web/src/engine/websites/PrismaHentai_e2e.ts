import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'prismahentai',
        title: 'Prisma Hentai'
    },
    container: {
        url: 'https://prismahentai.com/manga/607/',
        id: JSON.stringify({ post: '607', slug: '/manga/607/' }),
        title: 'A Rental Housekeeper'
    },
    child: {
        id: '/manga/607/cap-01/',
        title: 'Cap. 01'
    },
    entry: {
        index: 1,
        size: 1_646_0499,
        type: 'image/jpg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());