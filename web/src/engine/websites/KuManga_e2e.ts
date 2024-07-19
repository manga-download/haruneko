import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'kumanga',
        title: 'KuManga'
    }, /* CloudFlare
    container: {
        url: 'https://www.kumanga.com/manga/341/komi-san-wa-komyushou-desu',
        id: '341',
        title: 'Komi-san wa Komyushou Desu'
    },
    child: {
        id: '/manga/leer/460612',
        title: 'c. 472'
    },
    entry: {
        index: 3,
        size: 203_503,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());