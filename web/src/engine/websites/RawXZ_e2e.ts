import { TestFixture } from '../../../test/WebsitesFixture';

const mangaID = encodeURI('/manga/俺だけレベルアップな件-raw-free/');
const config = {
    plugin: {
        id: 'rawxz',
        title: 'RawXZ'
    },
    container: {
        url: 'https://rawxz.to/manga/俺だけレベルアップな件-raw-free/',
        id: JSON.stringify({ post: '32858', slug: mangaID }),
        title: '俺だけレベルアップな件',
    },
    child: {
        id: mangaID.toLowerCase() + encodeURI('第184話/').toLowerCase(),
        title: '第184話'
    },
    entry: {
        index: 0,
        size: 242_580,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();