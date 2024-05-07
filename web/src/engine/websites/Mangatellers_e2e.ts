import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangatellers',
        title: 'Mangatellers'
    },
    container: {
        url: 'https://reader.mangatellers.gr/series/mythos/',
        id: '/series/mythos/',
        title: 'Mythos'
    },
    child: {
        id: '/read/mythos/en/1/1/',
        title: 'Chapter 1: Peaceful Days.'
    },
    entry: {
        index: 0,
        size: 1_157_555,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());