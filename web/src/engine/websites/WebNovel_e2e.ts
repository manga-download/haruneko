import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'webnovel',
        title: 'Webnovel Comics'
    },
    container: {
        url: 'https://www.webnovel.com/comic/tales-of-demons-and-gods_14622895506049901',
        id: '14622895506049901',
        title: 'Tales of Demons and Gods'
    },
    child: {
        id: '40207390380972711',
        title: '1 : 001 A Second Chance'
    },
    entry: {
        index: 0,
        size: 408_693,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());