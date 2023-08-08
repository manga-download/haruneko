import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'realmscans',
        title: 'RealmScans'
    },
    container: {
        url: 'https://realmscans.xyz/m050523/series/demonic-master-of-mount-kunlun',
        id: '/m050523/series/demonic-master-of-mount-kunlun',
        title: 'Demonic Master of Mount Kunlun'
    },
    child: {
        id: '/m050523/demonic-master-of-mount-kunlun-chapter-49',
        title: 'Chapter 49'
    },
    entry: {
        index: 0,
        size: 155_262,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());