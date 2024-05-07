import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'senmanga',
        title: 'SenManga'
    },
    container: {
        url: 'https://www.senmanga.com/title/31b701a7-78bd-4bb5-931a-6308c807df88',
        id: '31b701a7-78bd-4bb5-931a-6308c807df88',
        title: 'Childhood Friendship Is Hard'
    },
    child: {
        id: '/read/97e46180-964c-43df-a73a-b9ce281a7d1d',
        title: 'Ch. 8 (pt-br)'
    },
    entry: {
        index: 1,
        size: 2_025_924,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());