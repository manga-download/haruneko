import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'yuramanga',
        title: 'YuraManga'
    },
    container: {
        url: 'https://www.yuramanga.my.id/2023/08/district-12.html',
        id: '/2023/08/district-12.html',
        title: 'District 12'
    },
    child: {
        id: '/2023/08/district-12-chapter-6.html',
        title: 'Chapter 6'
    },
    entry: {
        index: 1,
        size: 755_988,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());