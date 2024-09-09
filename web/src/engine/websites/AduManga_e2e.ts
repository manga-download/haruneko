import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'adumanga',
        title: 'AduManga'
    },
    container: {
        url: 'https://adumanga.com/manga/get-away-matsumoto/',
        id: '/manga/get-away-matsumoto/',
        title: 'Get away, Matsumoto!'
    },
    child: {
        id: '/get-away-matsumoto-bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 250_586,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());