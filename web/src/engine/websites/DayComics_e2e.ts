import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'daycomics',
        title: 'DayComics'
    },
    container: {
        url: 'https://daycomics.com/content/101023',
        id: '101023',
        title: 'Sex Study Group'
    },
    child: {
        id: '/content/101023/113522',
        title: 'Episode 1'
    },
    entry: {
        index: 0,
        size: 356_854,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());