import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'shadowmangas',
        title: 'ShadowMangas'
    },
    container: {
        url: 'https://shadowmangas.com/manga/realmente-no-soy-el-vasallo-del-dios-demonio/',
        id: '/manga/realmente-no-soy-el-vasallo-del-dios-demonio/',
        title: 'Realmente no soy el vasallo del dios demonio'
    },
    child: {
        id: '/realmente-no-soy-el-vasallo-del-dios-demonio-capitulo-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 912_450,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());