import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'seinagifansub-es',
        title: 'SeinagiFansub (ES)'
    },
    container: {
        url: 'https://online.seinagi.org.es/series/a_certain_idol_accelerato/',
        id: '/series/a_certain_idol_accelerato/',
        title: 'A Certain Idol Accelerato'
    },
    child: {
        id: '/read/a_certain_idol_accelerato/es/0/1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 1,
        size: 389_705,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());