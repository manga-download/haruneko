import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'sany',
        title: 'Sany'
    },
    container: {
        url: 'https://boylovewithsany.com/manga/rung-minh-chua-chat-ngot-ngao/',
        id: '/manga/rung-minh-chua-chat-ngot-ngao/',
        title: 'Rùng mình!? Chua chát, ngọt ngào!',
    },
    child: {
        id: '/rung-minh-chua-chat-ngot-ngao-chap-1-h/',
        title: 'chap 1 (H)'
    },
    entry: {
        index: 0,
        size: 286_708,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());