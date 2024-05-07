import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'laviniafansub',
        title: 'Lavinia Fansub'
    },
    container: {
        url: 'https://laviniafansub.com/manga/placebo-lets-play/',
        id: JSON.stringify({ post: '1068', slug: '/manga/placebo-lets-play/' }),
        title: `Placebo: Let's Play`
    },
    child: {
        id: '/manga/placebo-lets-play/27-bolum/',
        title: '27. Bölüm'
    },
    entry: {
        index: 2,
        size: 1_332_320,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());