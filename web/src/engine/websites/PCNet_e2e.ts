import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'pcnet',
        title: 'PCNet'
    },
    container: {
        url: 'http://pcnet.patyscans.com/series/kimi-ga-shinu-made-koi-wo-shitai/',
        id: '/series/kimi-ga-shinu-made-koi-wo-shitai/',
        title: 'Kimi ga Shinu Made Koi wo Shitai'
    },
    child: {
        id: '/read/kimi-ga-shinu-made-koi-wo-shitai/es/0/1/',
        title: 'Capítulo 1: Es un placer'
    },
    entry: {
        index: 1,
        size: 554_255,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());