import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'menudofansub',
        title: 'MenudoFansub'
    },
    container: {
        url: 'https://www.menudo-fansub.com/slide/series/a_channel/',
        id: '/slide/series/a_channel/',
        title: 'A channel'
    },
    child: {
        id: '/slide/read/a_channel/es/3/43/1/',
        title: 'Capítulo 43.1: Extra 1',
    },
    entry: {
        index: 1,
        size: 850_395,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());