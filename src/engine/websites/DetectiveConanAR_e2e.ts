import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'detectiveconanar',
        title: 'العربية  كونان (Conan Arabic)'
    },
    container: {
        url: 'https://manga.detectiveconanar.com/manga/hannin-no-hanzawa-san/',
        id: JSON.stringify({ post: '1858', slug: '/manga/hannin-no-hanzawa-san/' }),
        title: 'المجرم هانزاوا-سان'
    },
    child: {
        id: encodeURI('/manga/hannin-no-hanzawa-san/المجلد-1-الفصول-1-6/1-المجرم-يصل/').toLowerCase(),
        title: '1 - المجرم يصل'
    },
    entry: {
        index: 0,
        size: 515_774,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());