import { TestFixture } from '../../../test/WebsitesFixture';

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