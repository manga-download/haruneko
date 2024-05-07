import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'himerafansub',
        title: 'AyaToon'
    },
    container: {
        url: 'https://ayatoon.com/manga/the-peerless-sword-god/',
        id: '/manga/the-peerless-sword-god/',
        title: 'The Peerless Sword God'
    },
    child: {
        id: '/the-peerless-sword-god-bolum-1/',
        title: 'Bölüm 1',
        timeout: 10000
    },
    entry: {
        index: 0,
        size: 669_130,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());