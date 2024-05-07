import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangamovil',
        title: 'MangaMovil'
    },
    container: {
        url: 'https://mangamovil.net/manga/lilith-side-story',
        id: '/manga/lilith-side-story',
        title: 'Lilith Side Story'
    },
    child: {
        id: '/capitulo/lilith-side-story-4.00',
        title: '4.00'
    },
    entry: {
        index: 0,
        size: 538_520,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());