import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'magcomi',
        title: `MAGCOMI`
    },
    container: {
        url: 'https://magcomi.com/episode/4856001361578158443',
        id: '/episode/4856001361578158443',
        title: '琥珀の夢で酔いましょう'
    },
    child: {
        id: '/episode/4856001361178653776',
        title: '第33話「僕らはきっと旅に出る」'
    },
    entry: {
        index: 0,
        size: 1_443_425,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());