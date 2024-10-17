import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ninemanga-de',
        title: 'NineMangaDE'
    },
    container: {
        url: 'https://de.ninemanga.com/manga/Tales+of+Demons+and+Gods.html',
        id: '/manga/Tales+of+Demons+and+Gods.html',
        title: 'Tales of Demons and Gods',
    },
    child: {
        id: '/chapter/Tales%20of%20Demons%20and%20Gods/453688.html',
        title: 'Tales of Demons and Gods 160.5', //yes, chapter contains two times manga title, :D
    },
    entry: {
        index: 0,
        size: 409_917, //120_614 or 409_917
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());