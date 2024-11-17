import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ags',
        title: 'AGR (Animated Glitched Comics)'
    },
    container: {
        url: 'https://agrcomics.com/series/a4126222129/',
        id: '/series/a4126222129/',
        title: 'Reincarnated as the Mastermind of the Story'
    },
    child: {
        id: '/chapter/a4126222129-cb8dddee90e/',
        title: 'Chapter 23'
    },
    entry: {
        index: 1,
        size: 290_812,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();