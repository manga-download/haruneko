import { describe } from 'vitest';
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
        id: '/kaette-kudasai-akutsu-san-170/',
        title: 'Capítulo 170'
    },
    entry: {
        index: 1,
        size: 1_028_169,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());