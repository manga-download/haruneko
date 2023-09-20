import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'sinensisscan',
        title: 'Sinensis Scans',
        timeout : 120000, //warning : UNABLE TO TEST THIS TEST, AS WEBSITE IS ALWAYS TIMEOUTED
    },
    container: {
        url: 'https://sinensisscans.com/inicio1/manga/a-budgies-life/',
        id: JSON.stringify({ post: '9436', slug: '/inicio1/manga/a-budgies-life/' }),
        title: 'A Budgie’s Life',
        //timeout: 120000, //warning : UNABLE TO TEST THIS TEST, AS WEBSITE IS ALWAYS TIMEOUTED
    },/*
    child: {
        id: '/inicio1/manga/bastian2/cap-01/',
        title: 'Cap. 01',
        timeout: 120000, //warning : UNABLE TO TEST THIS TEST, AS WEBSITE IS ALWAYS TIMEOUTED

    },
    entry: {
        index: 0,
        size: 514_538,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());