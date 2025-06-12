import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangapark',
        title: 'MangaPark'
    },
    container: {
        url: 'https://mangapark.org/title/10953-en-one-piece',
        id: '10953',
        title: 'One Piece [en]'
    },
    child: {
        id: '9625399',
        title: 'Vol.TBE Ch.1146'
    },
    entry: {
        index: 0,
        size: 615_041,
        type: 'image/jpeg'
    }
}).AssertWebsite();