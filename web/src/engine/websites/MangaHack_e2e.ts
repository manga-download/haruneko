import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangahack',
        title: 'マンガハック (MangaHack)'
    },
    container: {
        url: 'https://mangahack.com/comics/11789',
        id: '/comics/11789',
        title: 'Triangle Story',
        timeout: 15000
    },
    child: {
        id: '/comics/11789/episodes/83658',
        title: '12...奪われた王国へ'
    },
    entry: {
        index: 0,
        size: 255_036,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());