import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'readmanhwa',
        title: 'ManhwaHentai.to'
    },
    container: {
        url: 'https://manhwahentai.to/pornhwa/ice-love/',
        id: JSON.stringify({ post: '329', slug: '/pornhwa/ice-love/' }),
        title: 'Ice Love'
    },
    child: {
        id: '/pornhwa/ice-love/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 830_187,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());