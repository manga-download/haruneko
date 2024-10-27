import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const configGlobal: Config = {
    plugin: {
        id: 'copymanga',
        title: 'CopyManga'
    },
    container: {
        url: 'https://www.copymanga.tv/comic/zhanvmeizhabao',
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

// CASE: No Region (Global)
new TestFixture(configGlobal).AssertWebsite();

const configChinaMainland = { ...configGlobal };
configChinaMainland.container.url = 'https://www.mangacopy.com/comic/zhanvmeizhabao';

// CASE: Region China
new TestFixture(configChinaMainland).AssertWebsite();