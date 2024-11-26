import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangademon',
        title: 'MangaDemon'
    },
    container: {
        url: 'https://demonicscans.org/manga/Martial-Peak',
        id: '/manga/Martial-Peak',
        title: 'Martial Peak'
    },
    child: {
        id: '/chaptered.php?manga=1&chapter=3670',
        title: '3670'
    },
    entry: {
        index: 0,
        size: 138_422,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();