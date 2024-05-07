import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangagun',
        title: 'MangaGun'
    },
    container: {
        url: 'https://mangagun.net/manga-oshi-no-ko-raw.html',
        id: '/manga-oshi-no-ko-raw.html',
        title: 'OSHI NO KO'
    },
    child: {
        id: '/gunchap-146-shmg-oshi-no-ko-raw.html',
        title: 'Chapter 146'
    },
    entry: {
        index: 0,
        size: 297_654,
        type: 'image/jpeg',
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());