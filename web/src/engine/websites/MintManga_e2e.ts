import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mintmanga',
        title: 'MintManga'
    },
    container: {
        url: 'https://mintmanga.live/voshojdenie_v_teni__A35c96',
        id: '/voshojdenie_v_teni__A35c96',
        title: 'Восхождение в тени',
    },
    child: {
        id: '/voshojdenie_v_teni__A35c96/vol9/53',
        title: '9 - 53',
        timeout: 30000

    },
    entry: {
        index: 0,
        size: 1_823_083,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());