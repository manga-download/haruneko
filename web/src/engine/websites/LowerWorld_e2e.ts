import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'lowerworld',
        title: 'Lower-World'
    },
    container: {
        url: 'https://lower-world.com/manga/yakisikli-olmak-cok-yorucu/',
        id: JSON.stringify({ post: '389', slug: '/manga/yakisikli-olmak-cok-yorucu/'}),
        title: 'Yakışıklı Olmak Çok Yorucu!'
    },
    child: {
        id: '/manga/yakisikli-olmak-cok-yorucu/53-bolum/',
        title: '53.Bölüm'
    },
    entry: {
        index: 1,
        size: 1_096_888,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());