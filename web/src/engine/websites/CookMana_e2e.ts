import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'cookmana',
        title: 'CookMana'
    },
    container: {
        url: 'https://cookmana.com/episode/3015/1/1',
        id: '3015',
        title: '장난을 잘치는 타카기 양'
    },
    child: {
        id: '1745031',
        title: '179화'
    },
    entry: {
        index: 0,
        size: 237_067,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());