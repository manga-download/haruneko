import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'daycomicsme',
        title: 'DayComics(.me)'
    },
    container: {
        url: 'https://daycomics.me/en/naughty-fantasy-land/7JVT6zAn.html',
        id: '/en/naughty-fantasy-land/7JVT6zAn.html',
        title: 'Naughty Fantasy Land'
    },
    child: {
        id: '/en/naughty-fantasy-land/episode-1-dzTlr3eK.html',
        title: '1 The Sorceress Who Fell into a Goblin Cave - I'
    },
    entry: {
        index: 0,
        size: 415_012,
        type: 'image/webp'
    }
}).AssertWebsite();