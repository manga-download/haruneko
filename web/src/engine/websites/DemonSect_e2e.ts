import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'demonsect',
        title: 'Demon Sect',
    },
    container: {
        url: 'https://dsectcomics.org/comics/reencarnacao-maldita/',
        id: '/comics/reencarnacao-maldita/',
        title: 'Reencarnação Maldita',
    },
    child: {
        id: '/reencarnacao-maldita-chapter-81-s2-fim/',
        title: 'Capítulo 81 {S2 FIM}',
    },
    entry: {
        index: 1,
        size: 1_882_466,
        type: 'image/jpeg',
        timeout: 10000
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());