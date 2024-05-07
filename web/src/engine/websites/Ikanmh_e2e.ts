import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ikanmh',
        title: 'Ikanmh'
    },
    container: {
        url: 'https://www.ikanmh.top/book/610',
        id: '/book/610',
        title: '浪漫露營'
    },
    child: {
        id: '/chapter/25657',
        title: '第1話-正值交配季節的露營場',
    },
    entry: {
        index: 0,
        size: 234_906,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());