import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'asurascans',
        title: 'Asura Scans',
    },
    container: {
        url: 'https://asuracomic.net/series/nano-machine-b755c1b9',
        id: '/series/nano-machine-',
        title: 'Nano Machine',
    },
    child: {
        id: '/series/nano-machine-/chapter/222',
        title: 'Chapter 222 76. Level (1)',
    },
    entry: {
        index: 1,
        size: 781_272,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();