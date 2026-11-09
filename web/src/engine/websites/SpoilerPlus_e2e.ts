import { TestFixture } from '../../../test/WebsitesFixture';

let mangaID = encodeURI('/キングダム').toUpperCase() + '-raw-free/';

//Case : Scrambled chapter
new TestFixture({
    plugin: {
        id: 'spoilerplus',
        title: 'SpoilerPlus'
    },
    container: {
        url: 'https://spoilerplus.tv/キングダム-raw-free/',
        id: mangaID,
        title: 'キングダム'
    },
    child: {
        id: mangaID.toLowerCase() + encodeURI('第796話/').toUpperCase(),
        title: '第796話',
        timeout: 10_000
    },
    entry: {
        index: 0,
        size: 1_117_221,
        type: 'image/png'
    }
}).AssertWebsite();

mangaID = encodeURI('/転生したらスライムだった件').toUpperCase() +'-raw-free/';

//Case : non scrambled chapter
new TestFixture({
    plugin: {
        id: 'spoilerplus',
        title: 'SpoilerPlus'
    },
    container: {
        url: 'https://spoilerplus.tv/転生したらスライムだった件-raw-free/',
        id: mangaID,
        title: '転生したらスライムだった件'
    },
    child: {
        id: mangaID.toLowerCase() + encodeURI('第60話/').toUpperCase(),
        title: '第60話'
    },
    entry: {
        index: 0,
        size: 314_932,
        type: 'image/jpeg'
    }
}).AssertWebsite();