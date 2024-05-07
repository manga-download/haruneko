import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'inmanga',
        title: 'InManga'
    },
    container: {
        url: 'https://inmanga.com/ver/manga/One-Piece/dfc7ecb5-e9b3-4aa5-a61b-a498993cd935',
        id: 'dfc7ecb5-e9b3-4aa5-a61b-a498993cd935',
        title: 'One Piece'
    },
    child: {
        id: '11bba49c-1512-4a47-839f-b4d6be007b1e',
        title: '1,074'
    },
    entry: {
        index: 1,
        size: 360_478,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());