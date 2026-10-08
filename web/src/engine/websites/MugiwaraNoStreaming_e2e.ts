import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mugiwaranostreaming',
        title: 'Mugiwara no Streaming'
    },
    container: {
        url: 'https://www.mugiwara-no-streaming.com/catalogue/one-piece/scans/original',
        id: '/catalogue/one-piece/scans/original',
        title: 'One Piece'
    },
    child: {
        id: '/One Piece/1/57',
        title: 'Chapitre 1'
    },
    entry: {
        index: 2,
        size: 725_879,
        type: 'image/jpeg'
    }
}).AssertWebsite();
