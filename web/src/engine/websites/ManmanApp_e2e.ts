import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'manmanapp',
        title: 'Manman Comic 漫漫漫画'
    },
    container: {
        url: 'https://www.manmanapp.com/comic-1403906.html',
        id: '/comic-1403906.html',
        title: '我与众神明'
    },
    child: {
        id: '/comic/detail-1486824.html',
        title: '第118话 完结'
    },
    entry: {
        index: 0,
        size: 33_603,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());