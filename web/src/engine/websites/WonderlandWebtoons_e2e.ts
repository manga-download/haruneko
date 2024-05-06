import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'wonderlandwebtoons',
        title: 'Wonderland Scan'
    },
    container: {
        url: 'https://wonderlandscan.com/manga/capitao-onde-fica-esse-campo-de-batalha/',
        id: JSON.stringify({ post: '2930', slug: '/manga/capitao-onde-fica-esse-campo-de-batalha/' }),
        title: 'Capitão! Onde fica esse campo de batalha?'
    },
    child: {
        id: '/manga/capitao-onde-fica-esse-campo-de-batalha/capitulo-01/',
        title: 'Capítulo 01'
    },
    entry: {
        index: 0,
        size: 756_144,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());