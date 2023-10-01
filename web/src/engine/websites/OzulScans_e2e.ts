import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'ozulscans',
        title: 'Ozul Scans'
    },
    container: {
        url: 'https://ozulscans.net/manga/8583513497-tale-of-a-scribe-who-retires-to-the-countryside/',
        id: '/manga/8583513497-tale-of-a-scribe-who-retires-to-the-countryside/',
        title: 'Tale of a Scribe Who Retires to the Countryside'
    },
    child: {
        id: '/9550131031-tale-of-a-scribe-who-retires-to-the-countryside-0/',
        title: 'الفصل 0'
    },
    entry: {
        index: 1,
        size: 331_939,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());