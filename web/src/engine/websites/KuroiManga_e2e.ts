import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kuroimanga',
        title: 'KuroiManga'
    },
    container: {
        url: 'https://kuroimanga.site/manga/yang-il-woo-ile-hikayemiz/',
        id: JSON.stringify({ post: '16772', slug: '/manga/yang-il-woo-ile-hikayemiz/' }),
        title: `Yang Il-woo ile Hikâyemiz`
    },
    child: {
        id: '/manga/yang-il-woo-ile-hikayemiz/bolum-33/',
        title: 'Bölüm 33'
    },
    /*  Chapters are behind login
        entry: {
            index: 0,
            size: 123_456,
            type: 'image/jpeg'
        }*/
}).AssertWebsite();