import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'cerisescans',
        title: 'Cerise Scans'
    }, /* CloudFlare
    container: {
        url: 'https://cerise.leitorweb.com/apenas-me-deixe-em-paz/',
        id: '/apenas-me-deixe-em-paz/',
        title: 'Apenas Me Deixe em Paz'
    },
    child: {
        id: '/apenas-me-deixe-em-paz/01/',
        title: 'Capítulo 01',
    },
    entry: {
        index: 0,
        size: 171_740,
        type: 'image/avif'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());