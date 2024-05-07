import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangachan',
        title: 'Манга-тян (Manga-chan)'
    },
    container: {
        url: 'https://manga-chan.me/manga/97358-hagure_roji.html',
        id: '/manga/97358-hagure_roji.html',
        title: '#hagure_roji (#приют_отшельников)'
    },
    child: {
        id: '/online/413999-stray_alley_v1_ch1.html',
        title: 'Том 1  Глава 1'
    },
    entry: {
        index: 0,
        size: 506_382,
        type: 'image/avif'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());