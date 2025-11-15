import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'rawsenmanga',
        title: 'RawSenManga'
    },
    container: {
        url: 'https://raw.senmanga.com/drcl-midnight-children',
        id: '/drcl-midnight-children',
        title: '#DRCL – Midnight Children'
    },
    child: {
        id: '/drcl-midnight-children/64',
        title: 'Chapter 64'
    },
    entry: {
        index: 0,
        size: 285_703,
        type: 'image/jpeg'
    }
}).AssertWebsite();