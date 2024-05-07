import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'kanjiku',
        title: 'Kanjiku'
    },
    container: {
        url: 'https://kanjiku.net/mangas/a_transmigrator_s_privilege',
        id: '/mangas/a_transmigrator_s_privilege',
        title: 'A Transmigrator’s Privilege',
    },
    child: {
        id: '/reader/a_transmigrator_s_privilege/4_0/0',
        title: 'Kapitel 4'
    },
    entry: {
        index: 0,
        size: 2_941_442,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());