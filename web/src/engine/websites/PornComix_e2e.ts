import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'porncomix',
        title: 'PornComix'
    },
    container: {
        url: 'https://bestporncomix.com/gallery/kitsume-na-kanojo-o-kaihatsu-shite-kozukuri-suru-made/',
        id: '/gallery/kitsume-na-kanojo-o-kaihatsu-shite-kozukuri-suru-made/',
        title: 'Kitsume na Kanojo o Kaihatsu shite Kozukuri suru made'
    },
    child: {
        id: '/gallery/kitsume-na-kanojo-o-kaihatsu-shite-kozukuri-suru-made/',
        title: 'Kitsume na Kanojo o Kaihatsu shite Kozukuri suru made'
    },
    entry: {
        index: 0,
        size: 287_491,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());