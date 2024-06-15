import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hentaiteca',
        title: 'HentaiTeca'
    },
    container: {
        url: 'https://hentaiteca.net/obra/mousou-theater-66/',
        id: JSON.stringify({ post: '2259', slug: '/obra/mousou-theater-66/' }),
        title: 'MOUSOU THEATER 66',
    },
    child: {
        id: '/obra/mousou-theater-66/ler-capitulo/',
        title: 'Ler Capítulo'
    },
    entry: {
        index: 0,
        size: 298_609,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());