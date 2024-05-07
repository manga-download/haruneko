import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'scanvf',
        title: 'Scan VF'
    },
    container: {
        url: 'https://www.scan-vf.net/jujutsu-kaisen',
        id: '/jujutsu-kaisen',
        title: 'Jujutsu Kaisen'
    },
    child: {
        id: '/jujutsu-kaisen/chapitre-220',
        title: '220'
    },
    entry: {
        index: 0,
        size: 375_015,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());