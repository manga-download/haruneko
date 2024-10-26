import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'spiderscans',
        title: 'Spider Scans'
    },
    container: {
        url: 'https://spiderscans.xyz/manga/demonic-sword-immortal/',
        id: '/manga/demonic-sword-immortal/',
        title: 'Demonic Sword Immortal'
    },
    child: {
        id: '/demonic-sword-immortal-chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 8,
        size: 774_918,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();