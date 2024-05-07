import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'manhwa18-int',
        title: 'Manhwa 18 (.net)'
    },
    container: {
        url: 'https://manhwa18.net/manga/may-i-help-you',
        id: '/manga/may-i-help-you',
        title: 'May I Help You?'
    },
    child: {
        id: '/manga/may-i-help-you/chap-01-677',
        title: 'chap 01'
    },
    entry: {
        index: 0,
        size: 476_512,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());