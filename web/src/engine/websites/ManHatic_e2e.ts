import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhatic',
        title: 'ManHatic'
    },
    container: {
        url: 'https://manhatic.com/manga/%d8%a7%d8%b3%d8%b1%d8%a7%d8%b1-%d8%a7%d9%84%d8%ac%d9%8a%d9%84-%d8%a7%d9%84%d8%ab%d8%a7%d9%84%d8%ab-%d9%85%d9%86-%d8%aa%d8%b4%d8%a7%d9%8a%d8%a8%d9%88%d9%84/',
        id: JSON.stringify({post: '2224', slug: '/manga/%d8%a7%d8%b3%d8%b1%d8%a7%d8%b1-%d8%a7%d9%84%d8%ac%d9%8a%d9%84-%d8%a7%d9%84%d8%ab%d8%a7%d9%84%d8%ab-%d9%85%d9%86-%d8%aa%d8%b4%d8%a7%d9%8a%d8%a8%d9%88%d9%84/'}),
        title: 'اسرار الجيل الثالث من تشايبول',
    },
    child: {
        id: '/manga/%d8%a7%d8%b3%d8%b1%d8%a7%d8%b1-%d8%a7%d9%84%d8%ac%d9%8a%d9%84-%d8%a7%d9%84%d8%ab%d8%a7%d9%84%d8%ab-%d9%85%d9%86-%d8%aa%d8%b4%d8%a7%d9%8a%d8%a8%d9%88%d9%84/52-%d8%a7%d9%84%d9%81%d8%b5%d9%84/',
        title: '52 الفصل'
    },
    entry: {
        index: 0,
        size: 359_224,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());