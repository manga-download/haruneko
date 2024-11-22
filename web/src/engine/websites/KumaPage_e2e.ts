import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kumapage',
        title: 'KumaPage'
    },
    container: {
        url: 'https://kumapage.com/read/Too+Cute+To+Handle+Bahasa+Indonesia',
        id: '/read/Too+Cute+To+Handle+Bahasa+Indonesia',
        title: 'Too Cute To Handle'
    },
    child: {
        id: '/read/Too+Cute+To+Handle+Bahasa+Indonesia/Chapter+66+%7E+TCTH',
        title: 'Chapter 66 ~ TCTH'
    },
    entry: {
        index: 1,
        size: 749_869,
        type: 'image/jpeg'
    }
}).AssertWebsite();