import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'lilymanga',
        title: 'Lily Manga'
    },
    container: {
        url: 'https://lilymanga.com/ys/liberty/',
        id: JSON.stringify({ post: '232', slug: '/ys/liberty/' }),
        title: 'Liberty'
    },
    child: {
        id: '/ys/liberty/chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 2_093_370,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());