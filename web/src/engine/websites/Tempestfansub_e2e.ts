import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'tempestfansub',
        title: 'Tempestfansub'
    },
    container: {
        url: 'https://tempestfansub.com/manga/chainsaw-man/',
        id: '/manga/chainsaw-man/',
        title: 'Chainsaw Man'
    },
    child: {
        id: '/chainsaw-man-1/',
        title: 'Bölüm 1',
        timeout: 15000
    },
    entry: {
        index: 1,
        size: 328_785,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());