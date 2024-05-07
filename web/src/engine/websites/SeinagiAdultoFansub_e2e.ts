import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'seinagiadultofansub',
        title: 'SeinagiAdultoFansub'
    },
    container: {
        url: 'https://adulto.seinagi.org.es/series/code_geass/',
        id: '/series/code_geass/',
        title: 'Code Geass'
    },
    child: {
        id: '/read/code_geass/es/0/1/',
        title: 'Capítulo 1: Code Geas R2'
    },
    entry: {
        index: 1,
        size: 764_559,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());