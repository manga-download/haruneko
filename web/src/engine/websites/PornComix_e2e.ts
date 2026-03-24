import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
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
        size: 285_864,
        type: 'image/webp'
    }
}).AssertWebsite();