import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'lilyumfansub',
        title: 'Lilyum Fansub'
    },
    container: {
        url: 'https://lilyumfansub.com.tr/manga/uchiha-sasukenin-sharingan-magarasi/',
        id: JSON.stringify({ post: '391', slug: '/manga/uchiha-sasukenin-sharingan-magarasi/' }),
        title: `Uchiha Sasuke'nin Sharingan Mağarası`
    },
    child: {
        id: '/manga/uchiha-sasukenin-sharingan-magarasi/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 360_571,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
