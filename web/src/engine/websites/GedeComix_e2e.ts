import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'gedecomix',
        title: 'GedeComix'
    },
    container: {
        url: 'https://gedecomix.com/porncomic/just-a-little-pervert-rui-chan-went-out-of-control-mira/',
        id: JSON.stringify({ post: '14982', slug: '/porncomic/just-a-little-pervert-rui-chan-went-out-of-control-mira/' }),
        title: 'Just A Little! Pervert Rui-Chan Went Out Of Control [Mira]'
    },
    child: {
        id: '/porncomic/just-a-little-pervert-rui-chan-went-out-of-control-mira/just-a-little-pervert-rui-chan-went-out-of-control/',
        title: 'Just A Little! Pervert Rui-Chan Went Out Of Control'
    },
    entry: {
        index: 2,
        size: 478_246,
        type: 'image/jpeg'
    }
}).AssertWebsite();