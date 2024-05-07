import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'momonohanascan',
        title: 'Momo no Hana Scan'
    },
    container: {
        url: 'https://momonohanascan.com/manga/ojousama-no-shimobe/',
        id: '{"post":"82","slug":"/manga/ojousama-no-shimobe/"}',
        title: 'Ojousama no Shimobe',
    },
    child: {
        id: '/manga/ojousama-no-shimobe/capitulo-70/',
        title: 'Capítulo 70',
    },
    entry: {
        index: 1,
        size: 516_548,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());