import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'argosscan',
        title: 'Argos Scan'
    },
    container: {
        url: 'https://argosscan.com/obras/159/battle-frenzy-webtoon-',
        id: '159',
        title: 'Battle Frenzy (Webtoon)'
    },
    child: {
        id: 'a204ff55-72b2-4ebe-b8db-ee9cfe138f48',
        title: 'Ch. 222 - Capítulo 222'
    },
    entry: {
        index: 0,
        size: 1_191_872,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());