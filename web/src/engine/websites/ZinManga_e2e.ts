import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'renascencescans',
        title: 'RenascenceScans'
    }/*,
    container: {
        url: 'https://new.renascans.com/manga/.../',
        id: JSON.stringify({ post: '0', slug: '/manga/.../' }),
        title: 'Manga ?'
    },
    child: {
        id: '/manga/.../.../',
        title: 'Chapter ?'
    },
    entry: {
        index: 0,
        size: -1,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());