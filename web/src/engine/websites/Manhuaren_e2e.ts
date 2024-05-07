import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuaren',
        title: 'Manhuaren 漫画人'
    },
    container: {
        url: 'https://manhuaren.com/manhua-zangsongdefulilian/?from=/manhua-list/',
        id: '/manhua-zangsongdefulilian/',
        title: '葬送的芙莉莲'
    },
    child: {
        id: '/m1499192/',
        title: '第122话',
        timeout: 10000
    },
    entry: {
        index: 0,
        size: 368_248,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());