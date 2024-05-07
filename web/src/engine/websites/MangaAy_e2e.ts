import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangaay',
        title: 'Manga Ay'
    },
    container: {
        url: 'https://manga-ay.com/manga/945',
        id: '/manga/945',
        title: 'Day Off',
    },
    child: {
        id: '/bolum/13284',
        title: 'Cilt 2 Bölüm 64 - Eğitim Gezisi'
    },
    entry: {
        index: 1,
        size: 404_257,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());