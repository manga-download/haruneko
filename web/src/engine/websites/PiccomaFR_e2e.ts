import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const fixture = new TestFixture({
    plugin: {
        id: 'piccoma-fr',
        title: 'Piccoma (French)'
    }, /* Region Locked
    container: {
        url: 'https://piccoma.com/fr/product/731',
        id: '731',
        title: 'Evangéline'
    },
    child: {
        id: '46944',
        title: '#1 Où et qui suis-je ?'
    },
    entry: {
        index: 0,
        size: 307_526,
        type: 'image/png'
    } */
});
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());