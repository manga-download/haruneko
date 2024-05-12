import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hqnow',
        title: 'Hq Now'
    },
    container: {
        url: 'https://www.hq-now.com/hq/1079/saga-do-infinito',
        id: '1079',
        title: 'Saga do Infinito'
    },
    child: {
        id: '11572',
        title: '1 : Prelúdio- Em Busca de Poder parte 1'
    },
    entry: {
        index: 0,
        size: 120_325,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());