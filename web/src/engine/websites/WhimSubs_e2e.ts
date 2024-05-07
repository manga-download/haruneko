import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'whimsubs',
        title: 'WhimSubs'
    },
    container: {
        url: 'https://whimsubs.xyz/r/series/shinka-no-mi/',
        id: '/r/series/shinka-no-mi/',
        title: 'Shinka no Mi'
    },
    child: {
        id: '/r/read/f80f3466-542d-4ec0-9c90-e940e7fc0818/',
        title: 'Chapter 35'
    },
    entry: {
        index: 0,
        size: 1_136_420,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());