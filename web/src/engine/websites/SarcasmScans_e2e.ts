import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'sarcasmscans',
        title: 'Sarcasm Scans'
    },
    container: {
        url: 'https://sarcasmscans.com/manga/distorted-soul/',
        id: JSON.stringify({ post: '300', slug: '/manga/distorted-soul/' }),
        title: 'Distorted Soul'
    },
    child: {
        id: '/manga/distorted-soul/bolum-1/',
        title: 'bölüm 1'
    },
    entry: {
        index: 1,
        size: 4_441_943,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());