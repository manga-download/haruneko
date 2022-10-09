import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'fusionscanlation',
        title: 'Fusion Scanlation'
    },
    container: {
        url: 'https://fusionscanlation.com/manga/drawing-romance/',
        id: '{"post":"1974","slug":"/manga/drawing-romance/"}',
        title: 'Drawing Romance'
    },
    child: {
        id: '/manga/drawing-romance/capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 0,
        size: 418_589,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());