import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangago',
        title: 'MangaGo'
    },
    container: {
        url: 'https://www.mangago.me/read-manga/the_dame_in_shining_armor/',
        id: '/read-manga/the_dame_in_shining_armor/',
        title: 'The Dame In Shining Armor'
    }, /* Chapters domains are random
    child: {
        id: '/chapter/72005/1708354/',
        title: 'Ch.10'
    },
    entry: {
        index: 0,
        size: 408_328,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());