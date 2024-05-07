import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'kissmangaorg',
        title: 'Kissmanga.org'
    },
    container: {
        url: 'https://kissmanga.org/manga/manga-ov991704',
        id: '/manga/manga-ov991704',
        title: 'My Brothers Dote On Me'
    },
    child: {
        id: '/chapter/manga-ov991704/chapter-155',
        title: 'Chapter 155'
    },
    entry: {
        index: 1,
        size: 156_374,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());