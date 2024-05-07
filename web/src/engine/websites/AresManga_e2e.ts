import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'aresmanga',
        title: 'Ares Manga'
    },
    /* Cloudflare
    container: {
        url: 'https://fl-ares.com/series/solo-max-level-newbie/',
        id: '/series/solo-max-level-newbie/',
        title: 'Solo Max Level Newbie'
    },
    child: {
        id: '/solo-max-level-newbie-chapter-140/',
        title: 'الفصل 140'
    },
    entry: {
        index: 0,
        size: 523_911,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());