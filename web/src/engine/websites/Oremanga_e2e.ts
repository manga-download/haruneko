import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'oremanga',
        title: 'Oremanga'
    },
    container: {
        url: 'https://www.oremanga.net/series/op/',
        id: '/series/op/',
        title: 'One Piece'
    },
    child: {
        id: '/one-piece/op-1101/',
        title: 'ตอนที่ 1101'
    },
    entry: {
        index: 2,
        size: 375_033,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());