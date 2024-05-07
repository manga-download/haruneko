import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'readcomicsonline',
        title: 'Read Comics Online'
    },
    container: {
        url: 'https://readcomicsonline.ru/comic/the-flash-2016',
        id: '/comic/the-flash-2016',
        title: 'The Flash (2016-)'
    },
    child: {
        id: '/comic/the-flash-2016/annual2022',
        title: '#Annual 2022'
    },
    entry: {
        index: 0,
        size: 1_446_980,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());