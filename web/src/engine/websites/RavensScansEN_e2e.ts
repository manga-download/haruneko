import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ravensscans-en',
        title: 'RavensScans (English)'
    },
    container: {
        url: 'https://ravens-scans.com/work/en/blattodea',
        id: JSON.stringify({
            id: 103,
            language: 2,
            stub: 'blattodea'

        }),
        title: 'Blattodea [en]'
    },
    child: {
        id: '3235',
        title: 'Vol. 4 Ch. 15.0 - Fujii Alice is hesitating'
    },
    entry: {
        index: 1,
        size: 676_089,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());