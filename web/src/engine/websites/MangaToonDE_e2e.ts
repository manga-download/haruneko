import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatoon-de',
        title: 'MangaToon (German)',
    },
    container: {
        url: 'https://de.mangatoon.mobi/1725-der-nationale-traummann-umwickelt-mich',
        id: '1725',
        title: 'Der nationale Traummann umwickelt mich'
    },
    child: {
        id: '19146',
        title: 'Ep.1'
    },
    entry: {
        index: 0,
        size: 22_426,
        type: 'image/webp'
    }
}).AssertWebsite();