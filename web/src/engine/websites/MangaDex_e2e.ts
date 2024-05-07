import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangadex',
        title: 'MangaDex'
    },
    container: {
        url: 'https://mangadex.org/title/43dec29e-821c-459b-983b-315ca12f2c02/ev',
        id: '43dec29e-821c-459b-983b-315ca12f2c02',
        title: 'eV'
    },
    child: {
        id: '6b095fee-c6fb-49f8-972d-8df4c54fbc24',
        title: 'Vol.01 Ch.0001 (en) [INKR Comics]'
    },
    entry: {
        index: 0,
        size: 290_930,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());