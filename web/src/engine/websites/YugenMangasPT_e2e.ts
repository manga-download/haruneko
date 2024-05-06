import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'yugenmangas-pt',
        title: 'YugenMangas (PT)'
    },
    container: {
        url: 'https://yugenmangas.org/series/para-amar-seu-inimigo/',
        id: '/series/para-amar-seu-inimigo/',
        title: 'Para Amar seu Inimigo'
    },
    child: {
        id: '/series/para-amar-seu-inimigo/capitulo-31/',
        title: 'Capítulo 31'
    },
    entry: {
        index: 1,
        size: 117_205,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());