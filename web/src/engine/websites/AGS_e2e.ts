import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ags',
        title: 'AGR (Animated Glitched Comics)'
    },
    container: {
        url: 'https://agrcomics.org/series/reincarnated-as-the-mastermind-of-the-story',
        id: '109',
        title: 'Reincarnated as the Mastermind of the Story'
    },
    child: {
        id: '/series/reincarnated-as-the-mastermind-of-the-story/chapter-23',
        title: 'Chapter 23'
    },
    entry: {
        index: 1,
        size: 290_812,
        type: 'image/jpeg'
    }
}).AssertWebsite();