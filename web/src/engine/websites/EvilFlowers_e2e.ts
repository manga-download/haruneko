import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'evilflowers',
        title: 'EvilFlowers'
    },
    container: {
        url: 'https://reader.evilflowers.com/series/a_good_person/',
        id: '/series/a_good_person/',
        title: 'A Good Person'
    },
    child: {
        id: '/read/a_good_person/en/1/1/1/',
        title: 'Chapter 1.1'
    },
    entry: {
        index: 8,
        size: 402_200,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());