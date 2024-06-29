import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'multporn',
        title: 'MultPorn'
    },
    container: {
        url: 'https://multporn.net/hentai_manga/azur_lane',
        id: '/hentai_manga/azur_lane',
        title: 'Azur Lane',
        timeout: 15000
    },
    child: {
        id: '/hentai_manga/a_maids_duty',
        title: `A Maid's Duty`
    },
    entry: {
        index: 0,
        size: 1_504_421,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());