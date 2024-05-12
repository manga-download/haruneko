import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangapure',
        title: 'MangaPure (manganelos)'
    },
    container: {
        url: 'https://mangapure.net/read/kuchi-ga-saketemo-kimi-ni-wa-2020',
        id: JSON.stringify({ post: '20048', slug: '/read/kuchi-ga-saketemo-kimi-ni-wa-2020' }),
        title: 'Kuchi ga Saketemo Kimi ni wa (2020)'
    },
    child: {
        id: '/manga/kuchi-ga-saketemo-kimi-ni-wa-2020-chapter-79',
        title: 'Chapter 79'
    },
    entry: {
        index: 0,
        size: 817_774,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());