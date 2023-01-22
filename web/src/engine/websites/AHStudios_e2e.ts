import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ahstudios',
        title: 'A.H Studio'
    },
    container: {
        url: 'https://ahstudios.net/manga/magic-emperor/',
        id: JSON.stringify({ post: '48', slug: '/manga/magic-emperor/' }),
        title: 'Magic Emperor'
    },
    child: {
        id: '/manga/magic-emperor/capitulo-1/',
        title: 'Capitulo 1'
    },
    entry: {
        index: 0,
        size: 544_663,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());