import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'nhentaicom',
        title: 'NHentaiCom'
    },
    container: {
        url: 'https://nhentai.com/en/comic/c95-hakuginmokusei-poshi-ero-rakugaki-bon-at-c95-fategrand-order-digital',
        id: 'c95-hakuginmokusei-poshi-ero-rakugaki-bon-at-c95-fategrand-order-digital',
        title: '(C95) [Hakuginmokusei (Poshi)] Ero Rakugaki Bon @ C95 (Fate/Grand Order) [Digital]'
    },
    child: {
        id: 'c95-hakuginmokusei-poshi-ero-rakugaki-bon-at-c95-fategrand-order-digital',
        title: '(C95) [Hakuginmokusei (Poshi)] Ero Rakugaki Bon @ C95 (Fate/Grand Order) [Digital]'
    },
    entry: {
        index: 0,
        size: 207_624,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());