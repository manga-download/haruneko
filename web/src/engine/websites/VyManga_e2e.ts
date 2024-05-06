import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'vymanga',
        title: 'VyManga'
    },
    container: {
        url: 'https://vyvymanga.net/manga/soul-land-iv',
        id: '/manga/soul-land-iv',
        title: 'Soul Land IV'
    },
    /* Chapter id is random, cant make a proper test
    child: {
        id: 'https://aovheroes.com/rds/br/rdsd?data=s4sdqf5qs4df5qs4fvsd54fsd53f43s5d4f135sdf',
        title: 'Chapter 464.5'
    },
    entry: {
        index: 0,
        size: -1,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());