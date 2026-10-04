import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Multi-Layered Images
new TestFixture({
    plugin: {
        id: 'linewebtoon',
        title: 'Line Webtoon',
    },
    container: {
        url: 'https://www.webtoons.com/id/horror/guidao/list?title_no=874',
        id: '/id/horror/guidao/list?title_no=874',
        title: 'Ghost Path',
    },
    child: {
        id: '/id/horror/guidao/prolog/viewer?title_no=874&episode_no=1',
        title: 'Prolog',
    },
    entry: {
        index: 2,
        size: 311_848,
        type: 'image/png',
    }
}).AssertWebsite();

// CASE: Standard Images
new TestFixture({
    plugin: {
        id: 'linewebtoon',
        title: 'Line Webtoon',
    },
    container: {
        url: 'https://www.webtoons.com/en/mystery/dr-frost/list?title_no=371',
        id: '/en/mystery/dr-frost/list?title_no=371',
        title: 'Dr. Frost',
    },
    child: {
        id: '/en/mystery/dr-frost/ep-0-prologue/viewer?title_no=371&episode_no=1',
        title: 'Ep. 0 - Prologue',
    },
    entry: {
        index: 0,
        size: 104_680,
        type: 'image/jpeg',
    }
}).AssertWebsite();

// CASE: Canvas category
new TestFixture({
    plugin: {
        id: 'linewebtoon',
        title: 'Line Webtoon',
    },
    container: {
        url: 'https://www.webtoons.com/en/canvas/meme-girls/list?title_no=304446',
        id: '/en/canvas/meme-girls/list?title_no=304446',
        title: 'Meme Girls',
    },
    child: {
        id: '/en/canvas/meme-girls/duolingo-chan/viewer?title_no=304446&episode_no=1',
        title: 'Duolingo-Chan',
    },
    entry: {
        index: 1,
        size: 25_898,
        type: 'image/jpeg',
    }
}).AssertWebsite();
