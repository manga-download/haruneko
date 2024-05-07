import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'raindropfansub',
        title: 'Rain Drop Fansub'
    },
    container: {
        url: 'https://www.raindropteamfan.com/manga/owari-no-seraph/',
        id: '/manga/owari-no-seraph/',
        title: 'Owari no Seraph'
    },
    child: {
        id: '/owari-no-seraph-121-bolum/',
        title: 'Bölüm 121 - Son Şafak'
    },
    entry: {
        index: 1,
        size: 493_945,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());