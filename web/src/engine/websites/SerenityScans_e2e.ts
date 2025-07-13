import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'serenityscans',
        title: 'Serenity Scans'
    },
    container: {
        url: 'https://serenityscans.com/series/92f742e22b0/',
        id: '/series/92f742e22b0/',
        title: 'The Demon Lord Regrets His Past Choices'
    },
    child: {
        id: '/chapter/92f742e22b0-104eff33f8e/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 55_786,
        type: 'image/jpeg'
    }
}).AssertWebsite();