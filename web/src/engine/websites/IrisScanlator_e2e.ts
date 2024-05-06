import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'irisscanlator',
        title: 'Iris Scanlator'
    },
    container: {
        url: 'https://irisscanlator.com.br/manga/orenchi-no-maid-san/',
        id: '/manga/orenchi-no-maid-san/',
        title: 'Orenchi no Maid-san'
    },
    child: {
        id: '/orenchi-no-maid-san-capitulo-01/',
        title: 'Chapter 01',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 383_954,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());