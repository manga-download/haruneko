import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicmedu',
        title: 'COMIC MeDu (こみっくめづ)'
    },
    container: {
        url: 'https://comic-medu.com/series/c2f3978c40eea',
        id: '/series/c2f3978c40eea',
        title: 'ぱらのいあけ〜じ'
    },
    child: {
        id: '/episodes/beaa305e9cf32/',
        title: 'その(1)'
    },
    entry: {
        index: 0,
        size: 760_096,
        type: 'image/png'
    }
}).AssertWebsite();