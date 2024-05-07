import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'sheep-scanlations',
        title: `Sheep's Awesome Mangas`
    },
    container: {
        url: 'https://hakuneko.download/sample-websites/sheep-scanlations/012.json',
        id: '/012.json',
        title: 'Real ➉'
    },
    child: {
        id: '/ch001',
        title: 'Chapter 1 - Beginning'
    },
    entry: {
        index: 0,
        size: 8582,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());