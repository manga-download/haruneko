import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Spanish manga chapter without volume and with sub-chapter
new TestFixture({
    plugin: {
        id: 'ravensscans',
        title: 'Ravens Scans'
    },
    container: {
        url: 'https://ravens-scans.com/work/es/blattodea',
        id: '93',
        title: 'Blattodea [es]'
    },
    child: {
        id: '2137',
        title: 'Ch. 8.5 - Me gustaría dejartela a ti (parte 2)'
    },
    entry: {
        index: 1,
        size: 448_079,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: English manga chapter with volume and without sub-chapter
new TestFixture({
    plugin: {
        id: 'ravensscans',
        title: 'Ravens Scans'
    },
    container: {
        url: 'https://ravens-scans.com/work/en/blattodea',
        id: '103',
        title: 'Blattodea [en]'
    },
    child: {
        id: '3235',
        title: 'Vol. 4 Ch. 15 - Fujii Alice is hesitating'
    },
    entry: {
        index: 1,
        size: 676_089,
        type: 'image/jpeg'
    }
}).AssertWebsite();