import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'rawlazy',
        title: 'RawLazy'
    },
    container: {
        url: 'https://rawlazy.ac/manga-lazy/彼女-お借りします-raw-free/',
        id: encodeURI('/manga-lazy/彼女-お借りします-raw-free/'),
        title: '彼女、お借りします'
    },
    child: {
        id: '/manga-chapter/%e5%bd%bc%e5%a5%b3%e3%80%81%e3%81%8a%e5%80%9f%e3%82%8a%e3%81%97%e3%81%be%e3%81%99-raw-%e3%80%90%e7%ac%ac340%e8%a9%b1%e3%80%91/',
        title: '第340話'
    },
    entry: {
        index: 0,
        size: 276_488,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());