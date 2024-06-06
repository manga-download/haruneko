import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'comictop',
        title: 'Comic Top'
    },
    container: {
        url: 'https://comic-top.com/manga/kenja-no-mago/',
        id: '/manga/kenja-no-mago/',
        title: '賢者の孫SP'
    },
    child: {
        id: '/viewer/?cid=30990&ct=kenja-no-mago-sp-chapter-1',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 188_688,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());