import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'reaperscanstr',
        title: 'Reaper Scans (Turkish)',
    },
    container: {
        url: 'https://reaperscanstr.com/seri/hyper-luck/',
        id: JSON.stringify({post : "1161", slug : "/seri/hyper-luck/"}),
        title: 'Hyper Luck'
    },
    child: {
        id: '/seri/hyper-luck/bolum-39/',
        title: 'Bölüm 39'
    },
    entry: {
        index: 1,
        size: 3_006_190,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());