import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'weloma',
        title: 'WeLoMa'
    },
    container: {
        url: 'https://weloma.art/429/',
        id: '/429/',
        title: 'SLIME TAOSHITE 300-NEN, SHIRANAI UCHI NI LEVEL MAX NI NATTEMASHITA - RAW'
    },
    child: {
        id: '/429/131864/',
        title: 'Chapter 73.1',
    },
    entry: {
        index: 0,
        size: 100_474,
        type: 'image/webp'
    }
}).AssertWebsite();