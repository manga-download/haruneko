import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'safirescan',
        title: 'Safire Scan'
    },
    container: {
        url: 'https://www.safirescan.site/2024/10/quando-lua-sobe-baixaria-comeca.html',
        id: '/2024/10/quando-lua-sobe-baixaria-comeca.html',
        title: 'Quando a Lua sobe a Baixaria Começa',
    },
    child: {
        id: '/2026/03/cap-59.html',
        title: 'Cap 59'
    },
    entry: {
        index: 1,
        size: 358_010,
        type: 'image/png'
    }
}).AssertWebsite();