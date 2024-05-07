import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'juinjutsuteam',
        title: 'JuinJutsu Team'
    },
    container: {
        url: 'https://www.juinjutsureader.ovh/series/dai-dark/',
        id: '/series/dai-dark/',
        title: 'Dai Dark'
    },
    child: {
        id: '/read/dai-dark/it/0/44/',
        title: '44 ita: Questa è la Damemaroom'
    },
    entry: {
        index: 1,
        size: 2_116_556,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());