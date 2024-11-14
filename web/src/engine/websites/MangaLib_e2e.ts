import { TestFixture } from '../../../test/WebsitesFixture';

const configWithBranches = {
    plugin: {
        id: 'mangalib',
        title: 'MangaLib'
    },
    container: {
        url: 'https://mangalib.org/ru/manga/7965--chainsaw-man',
        id: '7965--chainsaw-man',
        title: 'Человек-бензопила'
    },
    child: {
        id: JSON.stringify({ branch_id: '4667', number: '1', volume: '1' }),
        title: 'Том 1 Глава 1 - Пёс и бензопила [Nippa Team]'
    },
    entry: {
        index: 4,
        size: 314_272,
        type: 'image/webp'
    }
};

new TestFixture(configWithBranches).AssertWebsite();

const configWithoutBranches = {
    plugin: {
        id: 'mangalib',
        title: 'MangaLib'
    },
    container: {
        url: 'https://mangalib.org/ru/manga/210908--arlokk-the-atrocious',
        id: '210908--arlokk-the-atrocious',
        title: 'Злыдень Арлокк'
    },
    child: {
        id: JSON.stringify({ branch_id: '', number: '1', volume: '1' }),
        title: 'Том 1 Глава 1 - Встреча со злодеем'
    },
    entry: {
        index: 0,
        size: 126_508,
        type: 'image/webp'
    }
};

new TestFixture(configWithoutBranches).AssertWebsite();