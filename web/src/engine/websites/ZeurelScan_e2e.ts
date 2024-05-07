import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'zeurelscan',
        title: 'ZeurelScan'
    },
    container: {
        url: 'https://www.zeurelscan.com/serie.php?serie=24',
        id: '/serie.php?serie=24',
        title: 'Administrator Kang Jin Lee'
    },
    child: {
        id: '/Admin/Admin.php?capitolo=79',
        title: '#79'
    },
    entry: {
        index: 1,
        size: 252_568,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());