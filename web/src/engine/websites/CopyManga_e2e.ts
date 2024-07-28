import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'copymanga',
        title: 'CopyManga'
    },
    container: {
        url: 'https://copymanga.site/comic/zhanvmeizhabao',
        id: 'zhanvmeizhabao',
        title: '渣女沒渣報'
    },
    child: {
        id: '933b7a06-710e-11ee-84ec-55b00c27fb36',
        title: '第01話'
    },
    entry: {
        index: 0,
        size: 156_108,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());