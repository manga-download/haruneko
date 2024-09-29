import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangagalaxy',
        title: 'Manga Galaxy'
    }, /* CloudFlare
    container: {
        url: 'https://mangagalaxy.net/series/return-of-the-mob-character.',
        id: JSON.stringify({ slug: 'return-of-the-mob-character.', id: '116'}),
        title: 'Return of the Mob Character.'
    },
    child: {
        id: '/series/return-of-the-mob-character./chapter-1',
        title: '1'
    },
    entry: {
        index: 0,
        size: 650_744,
        type: 'image/webp'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());