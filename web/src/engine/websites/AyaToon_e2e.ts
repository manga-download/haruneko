import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'himerafansub',
        title: 'AyaToon'
    },
    container: {
        url: 'https://ayatoon.com/manga/the-peerless-sword-god/',
        id: JSON.stringify({ post: '264', slug: '/manga/the-peerless-sword-god/' }),
        title: 'The Peerless Sword God'
    },
    child: {
        id: '/manga/the-peerless-sword-god/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 696_347,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());