import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'cartoonmad',
        title: 'CarToonMad'
    },
    container: {
        url: 'https://www.cartoonmad.com/comic/1152.html', //One Piece
        id: '/comic/1152.html',
        title: '海賊王'
    },
    child: {
        id: '/comic/115200011104001.html',
        title: '第 001 卷'
    },
    entry: {
        index: 0,
        size: 116_736,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());