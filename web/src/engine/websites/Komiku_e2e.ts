import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'komiku',
        title: 'Komiku'
    },
    container: {
        url: 'https://komiku.id/manga/honyaku-no-sainou-de-ore-dake-ga-sekai-wo-kaihen-dekiru-ken/',
        id: '/manga/honyaku-no-sainou-de-ore-dake-ga-sekai-wo-kaihen-dekiru-ken/',
        title: '“Honyaku” no Sainou de Ore Dake ga Sekai wo Kaihen Dekiru Ken',
    },
    child: {
        id: '/ch/honyaku-no-sainou-de-ore-dake-ga-sekai-wo-kaihen-dekiru-ken-chapter-01/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 345_882,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());