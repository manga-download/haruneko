import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'skymangas',
        title: 'Sky Mangas'
    },
    container: {
        url: 'https://skymangas.com/manga/rooster-fighter/',
        id: '/manga/rooster-fighter/',
        title: 'Rooster Fighter'
    },
    child: {
        id: '/rooster-fighter-capitulo-3/',
        title: 'Chapter 3'
    },
    entry: {
        index: 2,
        size: 746_390,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());