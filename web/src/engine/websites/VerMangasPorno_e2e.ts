import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'vermangasporno',
        title: 'VerMangasPorno'
    }, /* CloudFlare
    container: {
        url: 'https://vermangasporno.com/doujin/121928.html',
        id: '/doujin/121928.html',
        title: '[Kusui Aruta] Hayaoki wa OO no Toku'
    },
    child: {
        id: '/doujin/121928.html',
        title: '[Kusui Aruta] Hayaoki wa OO no Toku'
    },
    entry: {
        index: 0,
        size: 266_355,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());