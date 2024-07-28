import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'hentaihere',
        title: 'HentaiHere'
    },
    container: {
        url: 'https://hentaihere.com/m/S49810',
        id: '/m/S49810',
        title: `You Said Just The Tip… I Asked My Brother's Girlfriend To Have Sex With Me Without A Condom!!`
    },
    child: {
        id: '/m/S49810/1/1/',
        title: '1'
    },
    entry: {
        index: 0,
        size: 292_691,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());