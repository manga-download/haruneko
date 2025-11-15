import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangatube',
        title: 'MangaTube',
    },
    container: {
        url: 'https://manga-tube.me/series/tales_of_demons_and_gods',
        id: 'tales_of_demons_and_gods',
        title: 'Tales of Demons and Gods'
    },
    child: {
        id: '17006',
        title: 'Kapitel 154.5 — Banketteinladung (2)',

    },
    entry: {
        index: 0,
        size: 735_517,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();