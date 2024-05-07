import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaship',
        title: 'Manga Ship'
    },
    container: {
        url: 'https://mangaship.net/Tr/Manga/undead-unluck',
        id: '/Tr/Manga/undead-unluck',
        title: 'Ölümsüz ve Şanssız'
    },
    child: {
        id: '/Tr/Manga/undead-unluck/51',
        title: '51.Bölüm Kahraman'
    },
    /*
    entry: { //login needed
        index: 1,
        size: 847_092,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());