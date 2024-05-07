import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'dmzj',
        title: '动漫之家(DMZJ)'
    },
    container: {
        url: 'https://www.idmzj.com/info/biaoren.html',
        id: 'biaoren',
        title: '镖人'
    },
    child: {
        id: JSON.stringify({
            comicId: 21046,
            chapterId: 145596
        }),
        title: '第113话'

    },
    entry: {
        index: 0,
        size: 516_096,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());