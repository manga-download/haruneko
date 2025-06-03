import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'laviniafansub',
        title: 'Lavinia Fansub'
    },
    container: {
        url: 'https://laviniafansub.com/manga/placebo-lets-playing-laviniafansub/',
        id: JSON.stringify({ post: '1068', slug: '/manga/placebo-lets-playing-laviniafansub/' }),
        title: `Placebo: Let's Play`
    },
    child: {
        id: '/manga/placebo-lets-playing-laviniafansub/27-bolum/',
        title: '27. Bölüm'
    }, /* Need Login
    entry: {
        index: 2,
        size: 1_332_320,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();