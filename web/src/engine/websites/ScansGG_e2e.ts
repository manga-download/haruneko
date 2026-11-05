import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'scansgg',
        title: 'Scans.GG'
    },
    container: {
        url: 'https://scans.gg/series/17796-game-survival-i-have-the-monopoly-on-monster-intel',
        id: '17796',
        title: 'Game Survival: I Have the Monopoly on Monster Intel'
    },
    child: {
        id: '/series/17796/105017',
        title: 'Chapter 37 [Qi]'
    },
    entry: {
        index: 0,
        size: 402_808,
        type: 'image/avif'
    }
}).AssertWebsite();