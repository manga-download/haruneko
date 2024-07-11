import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'ourfeel',
        title: 'OurFeel'
    },
    container: {
        url: 'https://ourfeel.jp/episode/2550689798581262969',
        id: '/episode/2550689798581262969',
        title: '私たちが恋する理由'
    },
    child: {
        id: '/episode/2550689798581263037',
        title: 'Reason.18'
    },
    entry: {
        index: 0,
        size: 2_618_111,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());