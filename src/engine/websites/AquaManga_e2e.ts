import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'aquamanga',
        title: 'AquaManga'
    },
    container: {
        url: 'https://aquamanga.com/read/martial-peak/',
        id: JSON.stringify({ post: '197', slug: '/read/martial-peak/' }),
        title: 'Martial Peak'
    },
    child: {
        id: '/read/martial-peak/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 267_930,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());