import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'robinmanga',
        title: 'RobinManga'
    },
    container: {
        url: 'https://www.robinmanga.com/manga/i-am-a-cultivation-bigshot/',
        id: '/manga/i-am-a-cultivation-bigshot/',
        title: 'I Am a Cultivation Bigshot'
    },
    child: {
        id: '/i-am-a-cultivation-bigshot-bolum-235/',
        title: 'Bölüm 235'
    },
    entry: {
        index: 1,
        size: 820_455,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());