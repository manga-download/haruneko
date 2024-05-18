import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'rainbowfairyscan',
        title: 'Rainbow Fairy Scan'
    },
    container: {
        url: 'https://rainbowfairyscan.com/manga/eu-vou-me-casar-com-ele/',
        id: JSON.stringify({ post: '389', slug: '/manga/eu-vou-me-casar-com-ele/'}),
        title: 'Eu Vou me Casar com Ele!',
    },
    child: {
        id: '/manga/eu-vou-me-casar-com-ele/02/',
        title: '02',
    },
    entry: {
        index: 0,
        size: 198_161,
        type: 'image/jpeg',
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());