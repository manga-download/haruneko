import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'hikariscan',
        title: 'Hikari Scan'
    },
    container: {
        url: 'https://hikariscan.org/manga/kaette-kudasai-akutsu-san/',
        id: '/manga/kaette-kudasai-akutsu-san/',
        title: 'Kaette Kudasai! Akutsu-san'
    },
    child: {
        id: '/kaette-kudasai-akutsu-san-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 0,
        size: 595_477,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());