import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mavimanga',
        title: 'Mavi Manga'
    },
    container: {
        url: 'https://mavimanga.com/manga/0c-magic/',
        id: '/manga/0c-magic/',
        title: '0°C Magic'
    },
    child: {
        id: '/r/manga/0c-magic/00',
        title: 'Bölüm 0'
    },
    entry: {
        index: 1,
        size: 394_371,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());