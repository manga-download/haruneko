import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'genztoon',
        title: 'GenzToon'
    },
    container: {
        url: 'https://genzupdates.com/series/7e80e1ac248/',
        id: '/series/7e80e1ac248/',
        title: 'A Bad Person'
    },
    child: {
        id: '/chapter/7e80e1ac248-96457646279/',
        title: 'Chapter 120',
        timeout: 10000
    },
    entry: {
        index: 2,
        size: 953_970,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();