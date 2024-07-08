import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'komiktap',
        title: 'KomikTap'
    },
    container: {
        url: 'https://komiktap.info/manga/a-sober-and-quiet-mother/',
        id: '/manga/a-sober-and-quiet-mother/',
        title: 'A Sober And Quiet Mother'
    },
    child: {
        id: '/a-sober-and-quiet-mother-chapter-1/',
        title: 'Chapter 1 End',
    },
    entry: {
        index: 0,
        size: 323_135,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());