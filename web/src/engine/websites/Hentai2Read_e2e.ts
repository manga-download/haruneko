import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'hentai2read',
        title: 'Hentai2R'
    },
    container: {
        url: 'https://hentai2read.com/twentyfourh_drug_store_big_tits_pharmacist_kusunokisan/',
        id: '/twentyfourh_drug_store_big_tits_pharmacist_kusunokisan/',
        title: '24H Drug Store: Big Tits Pharmacist Kusunoki-san'
    },
    child: {
        id: '/twentyfourh_drug_store_big_tits_pharmacist_kusunokisan/1/',
        title: '1 -  [Oneshot]'
    },
    entry: {
        index: 0,
        size: 190_822,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());