import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'scansmangasme',
        title: 'ScansMangas (ME)'
    },
    container: {
        url: 'https://scansmangas.me/manga/a-fantasy-lazy-life/',
        id: '/manga/a-fantasy-lazy-life/',
        title: 'A Fantasy Lazy Life'
    },
    child: {
        id: '/scan-risou-no-himo-seikatsu-56/',
        title: 'Scan Chapitre 56'
    },
    entry: {
        index: 0,
        size: 889_427,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());