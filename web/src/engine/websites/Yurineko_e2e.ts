import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'yurineko',
        title: 'Yurineko'
    },
    container: {
        url: 'https://yurineko.net/manga/3553',
        id: '3553',
        title: 'Ma Pháp Thiếu Nữ 201'
    },
    child: {
        id: '/read/3553/21995',
        title: 'Chap 4: Lần đầu bám đuôi'
    },
    entry: {
        index: 0,
        size: 475_199,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());