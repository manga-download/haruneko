import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangatale',
        title: 'Manga Tale'
    },
    container: {
        url: 'https://mangatale.id/manga/martial-peak/',
        id: '/manga/martial-peak/',
        title: 'Martial Peak'
    },
    child: {
        id: '/martial-peak-chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 124_648,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());