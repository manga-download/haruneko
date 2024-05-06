import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'knightnofansub',
        title: 'Knight no Fansub'
    },
    container: {
        url: 'https://lectorkns.com/sr/solo-subo-de-nivel/',
        id: JSON.stringify({ post: '1876', slug: '/sr/solo-subo-de-nivel/' }),
        title: 'Solo Level'
    },
    child: {
        id: '/sr/solo-subo-de-nivel/side-story-capitulo-21/',
        title: 'Side Story Capítulo 21 - Fin'
    },
    entry: {
        index: 1,
        size: 1_238_366,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());