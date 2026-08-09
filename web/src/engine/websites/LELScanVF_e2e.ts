import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lelscanvf',
        title: 'LELSCAN-VF'
    },
    container: {
        url: 'https://lelscanfr.com/manga/four-knights-of-the-apocalypse',
        id: '/manga/four-knights-of-the-apocalypse',
        title: 'Four Knights Of The Apocalypse',
        timeout: 15000
    },
    child: {
        id: '/manga/four-knights-of-the-apocalypse/144',
        title: 'Chapitre 144'
    },
    entry: {
        index: 0,
        size: 126_472,
        type: 'image/webp'
    }
}).AssertWebsite();