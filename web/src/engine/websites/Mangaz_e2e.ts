import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangaz',
        title: 'Manga Library Z (マンガ図書館Z)'
    },
    container: {
        url: 'https://www.mangaz.com/series/detail/207781',
        id: '/series/detail/207781',
        title: '海底軍艦'
    },
    child: {
        id: 'https://vw.mangaz.com/virgo/view/220123/i:0',
        title: '13'
    },
    entry: {
        index: 0,
        size: 525_231,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());