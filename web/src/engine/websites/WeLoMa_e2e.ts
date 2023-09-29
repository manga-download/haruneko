import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'weloma',
        title: 'WeLoMa'
    },
    container: {
        url: 'https://weloma.art/429/',
        id: '/429/',
        title: 'SLIME TAOSHITE 300-NEN, SHIRANAI UCHI NI LEVEL MAX NI NATTEMASHITA'
    },
    child: {
        id: '/429/131864/',
        title: 'Chapter 73.1',
    },
    entry: {
        index: 0,
        size: 546_228,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());