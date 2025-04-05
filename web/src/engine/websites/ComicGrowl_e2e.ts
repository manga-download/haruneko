import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicgrowl',
        title: 'コミックグロウル (Comic Growl)'
    },
    container: {
        url: 'https://comic-growl.com/series/42831552a0d66',
        id: '/series/42831552a0d66',
        title: '魔法使いの嫁'
    },
    child: {
        id: '/episodes/100daaf157782/',
        title: '1'
    },
    entry: {
        index: 6,
        size: 1_685_881,
        type: 'image/png'
    }
}).AssertWebsite();