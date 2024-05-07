import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangarawtop',
        title: 'MangaRawTop'
    },
    container: {
        url: 'https://mangaraw.top/manga/supido-hun-ruoki-she-zhangtono-qi-yue',
        id: '/manga/supido-hun-ruoki-she-zhangtono-qi-yue',
        title: 'スピード婚～若き社長との契約～'
    },
    child: {
        id: '/manga/supido-hun-ruoki-she-zhangtono-qi-yue/293hua',
        title: '293話'
    },
    entry: {
        index: 0,
        size: 180_574,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());