import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mirrorkomik',
        title: 'MirrorKomik',
    },
    container: {
        url: 'https://mirrorkomik.info/Manhwa/7-takdir-kapur-xv1',
        id: '/Manhwa/7-takdir-kapur-xv1',
        title: '7 Takdir: Kapur Xv1'
    },
    child: {
        id: '/chapter/7-takdir-kapur-xv1-JOjku1a-52',
        title: 'Chapter 52'
    },
    entry: {
        index: 0,
        size: 221_170,
        type: 'image/webp'
    }
}).AssertWebsite();