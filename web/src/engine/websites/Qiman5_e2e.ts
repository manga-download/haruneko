import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'qiman5',
        title: '奇漫屋 (Qiman5)'
    },
    container: {
        url: 'https://qiman2.com/16257.html',
        id: '/16257.html',
        title: '斗破苍穹之大主宰'
    },
    child: {
        id: '/16257/1274202.html',
        title: '1话 激战过后'
    },
    entry: {
        index: 3,
        size: 278_279,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());