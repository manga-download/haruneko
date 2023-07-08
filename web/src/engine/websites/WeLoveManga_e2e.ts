import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'lovehug',
        title: 'WeLoveManga.One'
    },
    container: {
        url: 'https://welovemanga.one/mgraw-1067/',
        id: '/mgraw-1067/',
        title: 'TONO KANRI O SHITE MIYOU'
    },
    child: {
        id: '/read-tono-kanri-o-shite-miyou-raw-chapter-65.2.html',
        title: 'Chapter 65.2',
    },
    entry: {
        index: 0,
        size: 219_948,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());