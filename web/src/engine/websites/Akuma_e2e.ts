import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const fixture = new TestFixture({
    plugin: {
        id: 'akuma',
        title: 'Akuma.moe'
    },
    container: {
        url: 'https://akuma.moe/g/dey7wcbd',
        id: '/g/dey7wcbd',
        title: '[Isikenpi] Lethargic Sister Tolerates her Brothers Pranks [English][DarklordMTLs]'
    },
    child: {
        id: '/g/dey7wcbd',
        title: '[Isikenpi] Lethargic Sister Tolerates her Brothers Pranks [English][DarklordMTLs]'
    },
    entry: {
        index: 5,
        size: 223_038,
        type: 'image/jpeg'
    }
});
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());