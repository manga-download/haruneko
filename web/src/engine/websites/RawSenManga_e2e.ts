import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'rawsenmanga',
        title: 'RawSenManga'
    },
    container: {
        url: 'https://raw.senmanga.com/akuyaku-reijou-no-shitsuji-sama-hametsu-flag-wa-ore-ga-tsubusasete-itadakimasu',
        id: '/akuyaku-reijou-no-shitsuji-sama-hametsu-flag-wa-ore-ga-tsubusasete-itadakimasu',
        title: 'Akuyaku Reijou no Shitsuji-sama: Hametsu Flag wa Ore ga Tsubusasete itadakimasu'
    },
    child: {
        id: '/akuyaku-reijou-no-shitsuji-sama-hametsu-flag-wa-ore-ga-tsubusasete-itadakimasu/29.1',
        title: 'Chapter 29.1'
    },
    entry: {
        index: 0,
        size: 300_977,
        type: 'image/jpeg' //In browser we get WEBP, in Haru JPEG because HARU use Accept : */* in headers, and not Accept : image/webp.
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());