import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'comicgardo',
        title: 'コミックガルド (Comic Gardo)'
    },
    container: {
        url: 'https://comic-gardo.com/episode/14079602755108116814',
        id: '/episode/14079602755108116814',
        title: '俺は星間国家の悪徳領主！'
    },
    child: {
        id: '/episode/14079602755156479105',
        title: '第25話「大増税だ!!」(3)'
    },
    entry: {
        index: 0,
        size: 1_168_802,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());