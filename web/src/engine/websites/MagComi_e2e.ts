import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'magcomi',
        title: `MAGCOMI`
    },
    container: {
        url: 'https://magcomi.com/episode/10834108156766453493',
        id: '/episode/10834108156766453493',
        title: '琥珀の夢で酔いましょう'
    },
    child: {
        id: '/episode/10834108156766453493',
        title: '第1話「Fly Me to the Amber Dream」'
    },
    entry: {
        index: 4,
        size: 1_784_147,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());