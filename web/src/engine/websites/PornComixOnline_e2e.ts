import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'porncomixonline',
        title: 'PornComix Online'
    },
    container: {
        url: 'https://www.porncomixonline.net/m-comic/shockabuki-hermione-and-grimoire-of-lust/',
        id: JSON.stringify({ post: '6220732', slug: '/m-comic/shockabuki-hermione-and-grimoire-of-lust/' }),
        title: 'Hermione and Grimoire of lust'
    },
    child: {
        id: '/m-comic/shockabuki-hermione-and-grimoire-of-lust/shockabuki-hermione-and-grimoire-of-lust/',
        title: 'Shockabuki – Hermione and Grimoire of lust'
    }, /*
    entry: {
        index: 0,
        size: 234_596, //picture size alternate between 226_729 and 234_596
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());