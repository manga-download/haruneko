import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangaswat',
        title: 'MangaSwat'
    },
    container: {
        url: 'https://maxlevelteam.com/manga/emperor-and-the-female-knight',
        id: '/manga/emperor-and-the-female-knight',
        title: 'Emperor And The Female Knight'
    },
    child: {
        id: '/manga/emperor-and-the-female-knight/emperor-and-the-female-knight-184',
        title: 'الفصل رقم: 184 FREE',
    },
    entry: {
        index: 1,
        size: 218_922,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());