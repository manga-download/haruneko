import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'lelscan',
        title: 'LELScan'
    },
    container: {
        url: 'https://lelscans.net/lecture-ligne-assassination-classroom.php',
        id: '/lecture-ligne-assassination-classroom.php',
        title: 'Assassination Classroom'
    },
    child: {
        id: '/scan-assassination-classroom/180',
        title: '180'
    },
    entry: {
        index: 2,
        size: 558_526,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());