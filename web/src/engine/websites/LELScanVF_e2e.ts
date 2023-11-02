import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'lelscanvf',
        title: 'LELSCAN-VF'
    },
    container: {
        url: 'https://www.lelscanvf.cc/manga/10-years-in-friend-zone',
        id: '/manga/10-years-in-friend-zone',
        title: '10 Years in Friend Zone'
    },
    child: {
        id: '/manga/10-years-in-friend-zone/13',
        title: '13'
    },
    entry: {
        index: 0,
        size: 1_044_171,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());