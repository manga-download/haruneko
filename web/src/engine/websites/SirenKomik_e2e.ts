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
        timeout : 15000
    },
    entry: {
        index: 0,
        size: 491_304,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());