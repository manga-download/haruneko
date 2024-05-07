import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'franxxmangas',
        title: 'Franxx Mangas'
    },
    container: {
        url: 'https://franxxmangas.net/manga/kuro-no-shoukanshi/',
        id: '/manga/kuro-no-shoukanshi/',
        title: 'Kuro no Shoukanshi'
    },
    child: {
        id: '/kuro-no-shoukanshi-capitulo-01/',
        title: 'Capítulo 01'
    },
    entry: {
        index: 3,
        size: 199_179,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());