import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'magusmanga',
        title: 'MagusManga'
    },
    container: {
        url: 'https://magustoon.org/series/i-became-a-level-999-mastermind-demon-king',
        id: JSON.stringify({ slug: 'i-became-a-level-999-mastermind-demon-king', id: 200 }),
        title: 'I Became A Level 999 Mastermind Demon King'
    },
    child: {
        id: '/series/i-became-a-level-999-mastermind-demon-king/chapter-25',
        title: '25 : Chapter 25'
    },
    entry: {
        index: 1,
        size: 784_872,
        type: 'image/jpeg'
    }
}).AssertWebsite();