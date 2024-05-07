import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'sadscans',
        title: 'Sadscans'
    },
    container: {
        url: 'https://sadscans.com/series/one-piece',
        id: '/series/one-piece',
        title: 'One Piece'
    },
    child: {
        id: '/reader/641c309d0406b',
        title: 'Bölüm 1079 - Kızıl Saç Korsanları - Bir İmparator\'un Tayfası'
    },
    entry: {
        index: 0,
        size: 234_180,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());