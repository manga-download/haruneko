import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'blmanhwaclub',
        title: 'BL Manhwa Club'
    },
    // Geo-blocked (Region: Brazil)
    /*
    container: {
        url: 'https://blmanhwa.club/bl/love-is-an-illusion/',
        id: JSON.stringify({ slug: '/bl/love-is-an-illusion/' }),
        title: 'Love is an Illusion'
    },
    child: {
        id: '/bl/love-is-an-illusion/capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 0,
        size: 46_947,
        type: 'image/jpeg'
    }
    */
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());