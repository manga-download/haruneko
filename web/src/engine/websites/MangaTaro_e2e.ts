import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangataro',
        title: 'MangaTaro'
    },
    container: {
        url: 'https://mangataro.org/manga/kaibutsu-shoujo-wa-hatsukoi-no-yume-wo-miru-ka',
        id: '/manga/kaibutsu-shoujo-wa-hatsukoi-no-yume-wo-miru-ka',
        title: 'Kaibutsu Shoujo wa Hatsukoi no Yume wo Miru ka?'
    },
    child: {
        id: '/read/kaibutsu-shoujo-wa-hatsukoi-no-yume-wo-miru-ka/ch21-1-469378',
        title: 'Ch. 21.1 N/A'
    },
    entry: {
        index: 0,
        size: 207_258,
        type: 'image/webp'
    }
}).AssertWebsite();