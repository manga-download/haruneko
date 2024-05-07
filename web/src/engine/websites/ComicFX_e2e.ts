import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'comicfx',
        title: 'Comic FX'
    },
    container: {
        url: 'https://comicfx.net/comic/dorei-tensei-sono-dorei-saikyou-no-moto-ouji-ni-tsuki',
        id: '/comic/dorei-tensei-sono-dorei-saikyou-no-moto-ouji-ni-tsuki',
        title: 'Dorei Tensei: Sono Dorei, Saikyou no Moto Ouji ni Tsuki'
    },
    child: {
        id: '/comic/dorei-tensei-sono-dorei-saikyou-no-moto-ouji-ni-tsuki/Chapter-034',
        title: 'Chapter 034'
    },
    entry: {
        index: 0,
        size: 185_704,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());