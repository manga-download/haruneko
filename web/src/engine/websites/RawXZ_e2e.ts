import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const mangaID = encodeURI('/jp-manga/俺だけレベルアップな件/');
const config = {
    plugin: {
        id: 'rawxz',
        title: 'RawXZ'
    },
    container: {
        url: 'https://rawxz.si/jp-manga/俺だけレベルアップな件/',
        id: JSON.stringify({ post: '37494', slug: mangaID }),
        title: '俺だけレベルアップな件',
    },
    child: {
        id: mangaID.toLowerCase() + encodeURI('第185話/').toLowerCase(),
        title: '第185話'
    },
    entry: {
        index: 0,
        size: 394_357,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());