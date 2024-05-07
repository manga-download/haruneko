import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: '8muses',
        title: '8 MUSES'
    },
    container: {
        url: 'https://comics.8muses.com/comics/album/Fakku-Comics/Hirama-Hirokazu',
        id: '/comics/album/Fakku-Comics/Hirama-Hirokazu',
        title: 'Hirama Hirokazu'
    },
    child: {
        id: '/comics/album/Fakku-Comics/Hirama-Hirokazu/How-to-Draw-Girls',
        title: 'How to Draw Girls'
    },
    entry: {
        index: 0,
        size: 880_077,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());