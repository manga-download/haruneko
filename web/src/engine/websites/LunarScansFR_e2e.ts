import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'lunarscansfr',
        title: 'Lunar Scans (FR)'
    },
    container: {
        url: 'https://lunarscans.fr/manga/regressor-of-the-fallen-family/',
        id: '/manga/regressor-of-the-fallen-family/',
        title: 'Regressor of the Fallen family'
    },
    child: {
        id: '/regressor-of-the-fallen-family-chapitre-4/',
        title: 'Chapitre 4'
    },
    entry: {
        index: 1,
        size: 1_300_265,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());