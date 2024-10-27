import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'yuramanga',
        title: 'YuraManga'
    },
    container: {
        url: 'https://www.yuramanga.my.id/series/demon-cage/',
        id: '/series/demon-cage/',
        title: 'Demon Cage'
    },
    child: {
        id: '/demon-cage-chapter-01-bahasa-indonesia/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 290_233,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();