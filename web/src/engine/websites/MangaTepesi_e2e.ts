import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatepesi',
        title: 'MangaTepesi'
    },
    container: {
        url: 'https://mangatepesi.com/manga/guard-pass/24',
        id: 'guard-pass/24',
        title: 'Guard Pass'
    },
    child: {
        id: '23-bolum/1930',
        title: '23.Bölüm'
    },
    entry: {
        index: 1,
        size: 1_467_126,
        type: 'image/jpeg'
    }
}).AssertWebsite();