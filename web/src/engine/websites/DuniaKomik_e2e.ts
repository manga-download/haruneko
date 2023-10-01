import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'gabutscans',
        title: 'Dunia Komik'
    },
    container: {
        url: 'https://duniakomik.org/manga/please-go-home-akutsu-san/',
        id: '/manga/please-go-home-akutsu-san/',
        title: 'Please Go Home, Akutsu-san!'
    },
    child: {
        id: '/please-go-home-akutsu-san-chapter-1-bahasa-indonesia/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 518_693,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());