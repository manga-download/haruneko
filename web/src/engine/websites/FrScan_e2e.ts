import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'frscan',
        title: 'FrScan'
    },
    container: {
        url: 'https://www.frscans.com/manga/100nin-no-eiyuu-o-sodateta-saikyou-yogensha-wa-boukensha-ni-natte-mo-sekaijuu-no-deshi-kara-shitawarete-masu',
        id: '/manga/100nin-no-eiyuu-o-sodateta-saikyou-yogensha-wa-boukensha-ni-natte-mo-sekaijuu-no-deshi-kara-shitawarete-masu',
        title: '100-Nin No Eiyuu O Sodateta Saikyou Yogensha Wa, Boukensha Ni Natte Mo Sekaijuu No Deshi Kara Shitawarete Masu'
    },
    child: {
        id: '/manga/100nin-no-eiyuu-o-sodateta-saikyou-yogensha-wa-boukensha-ni-natte-mo-sekaijuu-no-deshi-kara-shitawarete-masu/4',
        title: '4'
    },
    entry: {
        index: 0,
        size: 295_414,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());