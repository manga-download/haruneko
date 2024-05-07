import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangazure',
        title: 'Mangazure'
    },
    container: {
        url: 'https://www.mangazure.com/2024/01/black-corporation-joseon.html',
        id: 'black-corporation-joseon',
        title: 'Black Corporation: Joseon'
    },
    child: {
        id: '/2024/01/black-corporation-joseon-bolum-4.html',
        title: 'BÖLÜM 4'
    },
    entry: {
        index: 1,
        size: 294_917,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());