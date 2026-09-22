import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mugiwaranostreaming',
        title: 'Mugiwara no Streaming'
    },
    container: {
        url: 'https://www.mugiwara-no-streaming.com/catalogue/one-piece',
        id: 'One Piece',
        title: 'One Piece'
    },
    child: {
        id: '1',
        title: 'Chapitre 1'
    },
    entry: {
        index: 0,
        size: 3_613_874,
        type: 'image/jpeg'
    }
}).AssertWebsite();
