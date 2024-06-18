import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'manganelome',
        title: 'MangaNeloMe'
    },
    container: {
        url: 'https://manganelo.me/manga/apotheosis',
        id: '/manga/apotheosis',
        title: 'Apotheosis'
    },
    child: {
        id: '/apotheosis-chapter-1110',
        title: 'Chapter 1110'
    },
    entry: {
        index: 0,
        size: 720_600,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());