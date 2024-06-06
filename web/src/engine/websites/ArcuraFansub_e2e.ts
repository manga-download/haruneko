import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'arcurafansub',
        title: 'Arcura Fansub'
    },
    container: {
        url: 'https://arcurafansub.com/seri/1-24-romantizm/',
        id: '/seri/1-24-romantizm/',
        title: '1/24 Romantizm'
    },
    child: {
        id: '/1-24-romantizm-28-bolum/',
        title: 'Bölüm 28'
    }, /*
    entry: {    //Login needed
        index: 0,
        size: -1,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());