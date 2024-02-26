import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'rawxz',
        title: 'RawXZ'
    },
    container: {
        url: 'https://rawxz.com/comic/%e4%bf%ba%e3%81%a0%e3%81%91%e3%83%ac%e3%83%99%e3%83%ab%e3%82%a2%e3%83%83%e3%83%97%e3%81%aa%e4%bb%b6-raw/',
        id: JSON.stringify({ post: '6708', slug: '/comic/%e4%bf%ba%e3%81%a0%e3%81%91%e3%83%ac%e3%83%99%e3%83%ab%e3%82%a2%e3%83%83%e3%83%97%e3%81%aa%e4%bb%b6-raw/' }),
        title: '俺だけレベルアップな件',
    },
    child: {
        id: '/comic/%e4%bf%ba%e3%81%a0%e3%81%91%e3%83%ac%e3%83%99%e3%83%ab%e3%82%a2%e3%83%83%e3%83%97%e3%81%aa%e4%bb%b6-raw/%e7%ac%ac185%e8%a9%b1/',
        title: '第185話'
    },
    entry: {
        index: 0,
        size: 203_012,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());