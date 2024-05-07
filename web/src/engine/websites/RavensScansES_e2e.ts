import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ravensscans-es',
        title: 'RavensScans (Spanish)'
    },
    container: {
        url: 'https://ravens-scans.com/work/es/karada_sagashi',
        id: JSON.stringify({
            id: 163,
            language: 1,
            stub: 'karada_sagashi'

        }),
        title: 'Karada Sagashi [es]'
    },
    child: {
        id: '3152',
        title: 'Vol. 1 Ch. 1.0'
    },
    entry: {
        index: 1,
        size: 880_274,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());