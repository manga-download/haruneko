import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'modescanlator',
        title: 'Mode Scanlator'
    },
    container: {
        url: 'https://modescanlator.com/eternal-first-son-in-law/',
        id: '/eternal-first-son-in-law/',
        title: 'Eternal First Son-In-Law',
    },
    child: {
        id: '/eternal-first-son-in-law/299/',
        title: 'Capítulo 299',
    },
    entry: {
        index: 0,
        size: 157_765,
        type: 'image/avif'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());