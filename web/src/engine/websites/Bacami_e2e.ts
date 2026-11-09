import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'bacami',
        title: 'Bacami',
    },
    container: {
        url: 'https://v1.bacami.site/komik/a-dragonslayers-peerless-regression/',
        id: '/komik/a-dragonslayers-peerless-regression/',
        title: 'A Dragonslayer’s Peerless Regression'
    },
    child: {
        id: '/a-dragonslayers-peerless-regression-chapter-107/',
        title: 'Chapter 107'
    },
    entry: {
        index: 1,
        size: 745_544,
        type: 'image/jpeg'
    }
}).AssertWebsite();