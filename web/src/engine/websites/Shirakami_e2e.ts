import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'shirakami',
        title: 'Shirakami'
    },
    container: {
        url: 'https://shirakami.xyz/manga/a-bad-person/',
        id: '/manga/a-bad-person/',
        title: 'A Bad Person'
    },
    child: {
        id: '/komik-a-bad-person-chapter-166/',
        title: 'Chapter 166'
    },
    entry: {
        index: 0,
        size: 197_827,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());