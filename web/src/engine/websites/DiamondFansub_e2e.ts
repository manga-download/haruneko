import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'diamondfansub',
        title: 'DiamondFansub'
    },
    container: {
        url: 'https://diamondfansub.com/seri/patron-kurt-ve-kucuk-patates/',
        id: JSON.stringify({ post: '390', slug: '/seri/patron-kurt-ve-kucuk-patates/' }),
        title: 'Patron Kurt ve Küçük Patates'
    },
    child: {
        id: '/seri/patron-kurt-ve-kucuk-patates/bolum-107-5/',
        title: 'Bölüm 107.5 - Yeni Saç Stilleri Denemek'
    },
    entry: {
        index: 0,
        size: 1_194_539,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());