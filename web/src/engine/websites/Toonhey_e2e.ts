import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'toonhey',
        title: 'Toonhey'
    },
    container: {
        url: 'https://toonhey.com/en/outlaw-girl/83g3jisR.html',
        id: '/en/outlaw-girl/83g3jisR.html',
        title: 'Outlaw Girl'
    },
    child: {
        id: '/en/outlaw-girl/episode-1-QgTomsmT.html',
        title: 'Episode 1 - Prologue'
    },
    entry: {
        index: 0,
        size: 92_434,
        type: 'image/webp'
    }
}).AssertWebsite();