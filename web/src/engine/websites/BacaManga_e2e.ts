import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'bacamanga',
        title: 'BacaManga'
    },
    container: {
        url: 'https://bacamanga.id/manga/50kg-cinderella/',
        id: '/manga/50kg-cinderella/',
        title: '-50kg Cinderella'
    },
    child: {
        id: '/50kg-cinderella-chapter-1-1/',
        title: 'Chapter 1.1'
    },
    entry: {
        index: 2,
        size: 57_750,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());