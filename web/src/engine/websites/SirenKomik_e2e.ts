import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'sirenkomik',
        title: 'SirenKomik'
    },
    container: {
        url: 'https://sirenkomik.my.id/manga/undead-king-teihen-bouken-sha-mamono-no-chikara-de-shinka-musou/',
        id: '/manga/undead-king-teihen-bouken-sha-mamono-no-chikara-de-shinka-musou/',
        title: 'Undead King ~Teihen Bouken-sha, Mamono no Chikara de Shinka Musou~'
    },
    child: {
        id: '/undead-king-teihen-bouken-sha-mamono-no-chikara-de-shinka-musou-chapter-1/',
        title: 'Chapter 1',
        //timeout: 15000
    },
    entry: {
        index: 1,
        size: 1_274_763,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());