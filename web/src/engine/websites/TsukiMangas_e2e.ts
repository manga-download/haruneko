import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tsukimangas',
        title: 'Tsuki-Mangas'
    }, /* CloudFlare
    container: {
        url: 'https://tsuki-mangas.com/obra/105/tower-of-god-3-season',
        id: '105',
        title: 'Tower of God 3 season'
    },
    child: {
        id: '/read/207989/34655/1',
        title: '217'
    },
    entry: {
        index: 0,
        size: 632_904,
        type: 'image/png'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());