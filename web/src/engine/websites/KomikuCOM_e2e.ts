import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'komikucom',
        title: 'Komiku.COM'
    },
    container: {
        url: 'https://komiku.com/manga/my-wife-and-i-dominate-the-three-realms/',
        id: '/manga/my-wife-and-i-dominate-the-three-realms/',
        title: 'My Wife and I Dominate the Three Realms'
    },
    child: {
        id: '/my-wife-and-i-dominate-the-three-realms-chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 25_762,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());