import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'noranofansub',
        title: 'NoraNoFansub'
    },
    container: {
        url: 'https://www.noranofansub.com/lector/series/your-royal-highness-is-happy/',
        id: '/lector/series/your-royal-highness-is-happy/',
        title: 'Your Royal Highness is Happy'
    },
    child: {
        id: '/lector/read/your-royal-highness-is-happy/es-cl/1/1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 0,
        size: 218_047,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());