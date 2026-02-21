import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture( {
    plugin: {
        id: 'rimuscans',
        title: 'RimuScans'
    },
    container: {
        url: 'https://rimuscans.com/manga/top-tier-providence',
        id: 'top-tier-providence',
        title: 'Top Tier Providence'
    },
    child: {
        id: 'cmjvpdto90b0x1455jqyq4g0e',
        title: 'Chapitre 1'
    },
    entry: {
        index: 0,
        size: 282_827,
        type: 'image/jpeg'
    }
}).AssertWebsite();