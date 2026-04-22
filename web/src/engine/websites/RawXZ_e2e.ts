import { TestFixture } from '../../../test/WebsitesFixture';

const mangaID = encodeURI('/manga/俺だけレベルアップな件-raw-free/');
new TestFixture({
    plugin: {
        id: 'rawxz',
        title: 'RawZO'
    },
    container: {
        url: 'https://rawzo.net/manga/俺だけレベルアップな件-raw-free/',
        id: mangaID,
        title: '俺だけレベルアップな件',
    },
    child: {
        id: `${mangaID.toLowerCase()}chapter-184/`,
        title: '第 184'
    },
    entry: {
        index: 0,
        size: 242_580,
        type: 'image/jpeg'
    }
}).AssertWebsite();