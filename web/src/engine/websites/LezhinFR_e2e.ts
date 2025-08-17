import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'delitoon',
        title: 'Lezhin (French)'
    },
    container: {
        url: 'https://www.lezhinfr.com/detail/daf_4100032',
        id: 'daf_4100032',
        title: `Moriarty's Perfect Crime`
    },
    child: {
        id: '1',
        title: '1'
    },
    entry: {
        index: 0,
        size: 96_500,
        type: 'image/webp'
    }
}).AssertWebsite();