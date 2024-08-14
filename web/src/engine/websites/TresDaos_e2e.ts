import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tresdaos',
        title: 'Tres Daos'
    },
    container: {
        url: 'https://tresdaos.com/manga/vengeance-of-the-heavenly-demon/',
        id: '/manga/vengeance-of-the-heavenly-demon/',
        title: 'Vengeance of the Heavenly Demon'
    },
    child: {
        id: '/vengeance-of-the-heavenly-demon-chapter-1/',
        title: 'Capítulo 1',
    },
    entry: {
        index: 0,
        size: 532_427,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());