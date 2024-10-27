import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'delitoon',
        title: 'Delitoon'
    },
    container: {
        url: 'https://www.delitoon.com/detail/daf_4100032',
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
};

new TestFixture(config).AssertWebsite();