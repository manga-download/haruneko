import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'furyosquad',
        title: 'Furyo Squad'
    },
    container: {
        url: 'https://www.furyosquad.com/series/about/',
        id: '/series/about/',
        title: 'A-BOUT!'
    },
    child: {
        id: '/read/about/fr/19/165/',
        title: 'Vol.19 Chapitre 165: Viré du lycée'
    },
    entry: {
        index: 1,
        size: 891_587,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());