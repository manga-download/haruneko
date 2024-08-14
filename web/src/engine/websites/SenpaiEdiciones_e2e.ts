import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'senpaiediciones',
        title: 'Senpai Ediciones'
    },
    container: {
        url: 'https://senpaimangas.online/manga/isekai-walking/',
        id: '/manga/isekai-walking/',
        title: 'Isekai Walking'
    },
    child: {
        id: '/isekai-walking-capitulo-01-1/',
        title: 'Capítulo 01.1'
    },
    entry: {
        index: 0,
        size: 855_206,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());