import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'akumanga',
        title: 'AkuManga'
    },
    container: {
        url: 'https://akumanga.com/manga/the-last-human/',
        id: JSON.stringify({ post: '2541', slug: '/manga/the-last-human/' }),
        title: 'The Last Human'
    },
    child: {
        id: '/manga/the-last-human/1/',
        title: '1'
    },
    entry: {
        index: 0,
        size: 88_235,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());