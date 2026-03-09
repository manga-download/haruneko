import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'rawsenmanga',
        title: 'RawSenManga'
    },
    container: {
        url: 'https://raw.senmanga.com/one-piece',
        id: 'one-piece',
        title: 'One Piece'
    },
    child: {
        id: '1170.243648',
        title: 'Chapter 1170'
    },
    entry: {
        index: 0,
        size: 507_052,
        type: 'image/jpeg'
    }
}).AssertWebsite();