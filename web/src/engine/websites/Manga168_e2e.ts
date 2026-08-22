import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manga168',
        title: 'Manga168'
    },
    container: {
        url: 'https://manga168x.com/manga/overgeared-remake',
        id: '135587',
        title: 'Overgeared (Remake)'
    },
    child: {
        id: '330',
        title: '330'
    },
    entry: {
        index: 0,
        size: 345_916,
        type: 'image/webp'
    }
}).AssertWebsite();

new TestFixture({
    plugin: {
        id: 'manga168',
        title: 'Manga168'
    },
    container: {
        url: 'https://manga168x.com/manga/one-piece',
        id: '272',
        title: 'One Piece'
    },
    child: {
        id: '1190',
        title: '1190'
    }
}).AssertWebsite();

new TestFixture({
    plugin: {
        id: 'manga168',
        title: 'Manga168'
    },
    container: {
        url: 'https://manga168x.com/manga/the-sword-eating-swordmaster',
        id: '778653',
        title: 'The Sword-Eating Swordmaster'
    },
    child: {
        id: '40',
        title: '40'
    }
}).AssertWebsite();
