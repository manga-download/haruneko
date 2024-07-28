import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'comicgardo',
        title: 'コミックガルド (Comic Gardo)'
    },
    container: {
        url: 'https://comic-gardo.com/episode/14079602755108116814',
        id: '/episode/14079602755108116814',
        title: '俺は星間国家の悪徳領主！'
    },
    child: {
        id: '/episode/3269754496561191129',
        title: '第1話「案内人」'
    },
    entry: {
        index: 0,
        size: 1_684_896,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());