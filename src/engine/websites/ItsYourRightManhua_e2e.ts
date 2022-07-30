import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'itsyourightmanhua',
        title: 'Its Your Right Manhua'
    },
    container: {
        url: 'https://itsyourightmanhua.com/manga/magic-scroll-merchant-zio/',
        id: JSON.stringify({ post: '851', slug: '/manga/magic-scroll-merchant-zio/' }),
        title: 'Magic Scroll Merchant Zio'
    },
    child: {
        id: '/manga/magic-scroll-merchant-zio/chapter-000/',
        title: 'Chapter 000'
    },
    entry: {
        index: 1,
        size: 1_497_921,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());