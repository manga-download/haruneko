import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'crunchyscan',
        title: 'Crunchyscan'
    },
    container: {
        url: 'https://crunchyscan.fr/liste-manga/lucia/',
        id: JSON.stringify({ post: '5609', slug: '/liste-manga/lucia/' }),
        title: 'Lucia'
    },
    // Custom Re-Captcha check... cannot be bypassed without user interaction
    /*
    child: {
        id: '/liste-manga/lucia/chapitre-1/',
        title: 'Chapitre 1'
    },
    entry: {
        index: 0,
        size: 76071,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());