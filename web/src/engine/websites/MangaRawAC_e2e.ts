import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const mangaID = encodeURI('/manga/呪術廻戦-raw-free/').toLowerCase();
const config = {
    plugin: {
        id: 'mangarawac',
        title: 'MangaRawAC'
    },
    container: {
        url: 'https://mangaraw.ac' + mangaID,
        id: mangaID,
        title: '呪術廻戦'
    },
    child: {
        id: mangaID + encodeURI('第1話/'),
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 156_354,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());