import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'weloma',
        title: 'WeLoMa'
    },
    container: {
        url: 'https://weloma.net/m/0zPkf',
        id: '/m/0zPkf',
        title: 'SLIME TAOSHITE 300-NEN, SHIRANAI UCHI NI LEVEL MAX NI NATTEMASHITA'
    },
    child: {
        id: '/c/qCcUo',
        title: 'Chapter 73.1',
    },
    entry: {
        index: 0,
        size: 100_474,
        type: 'image/webp'
    }
}).AssertWebsite();