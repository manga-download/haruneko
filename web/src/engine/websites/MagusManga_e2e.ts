import { TestFixture } from '../../../test/WebsitesFixture';

// Case : good pages order
new TestFixture({
    plugin: {
        id: 'magusmanga',
        title: 'MagusManga'
    },
    container: {
        url: 'https://magustoon.org/series/i-became-a-level-999-mastermind-demon-king',
        id: '200',
        title: 'I Became A Level 999 Mastermind Demon King'
    },
    child: {
        id: '/series/i-became-a-level-999-mastermind-demon-king/chapter-25',
        title: 'Chapter 25 - Chapter 25'
    },
    entry: {
        index: 0,
        size: 77_987,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// Case : messed up pages order
new TestFixture({
    plugin: {
        id: 'magusmanga',
        title: 'MagusManga'
    },
    container: {
        url: 'https://magustoon.org/series/the-merman-trapped-in-my-lake',
        id: '206',
        title: 'The Merman Trapped in My Lake'
    },
    child: {
        id: '/series/the-merman-trapped-in-my-lake/chapter-1',
        title: 'Chapter 1 - Chapter 1'
    },
    entry: {
        index: 12,
        size: 156_884,
        type: 'image/jpeg'
    }
}).AssertWebsite();
