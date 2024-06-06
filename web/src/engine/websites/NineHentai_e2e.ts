import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: '9hentai',
        title: '9hentai'
    },
    container: {
        url: 'https://9hentai.com/g/61506/',
        id: '/g/61506/',
        title: '(@RoBosquat) Aphrodisiacs and Giyushino (Demon Slayer)',
    },
    child: {
        id: '/g/61506/',
        title: '(@RoBosquat) Aphrodisiacs and Giyushino (Demon Slayer)',
    },
    entry: {
        index: 0,
        size: 344_537,
        type: 'image/jpeg',
        timeout: 30000

    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());