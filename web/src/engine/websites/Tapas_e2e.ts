import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tapas',
        title: 'Tapas'
    },
    container: { //content is region locked, keep that in mind !
        url: 'https://tapas.io/series/279061',
        id: '279061',
        title: `When You're in Love`
    },
    child: {
        id: '/episode/3117541',
        title: 'Episode 1'
    },
    entry: {
        index: 1,
        size: 57_370,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());