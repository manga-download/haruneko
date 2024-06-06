import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'ungtycomic',
        title: 'Ung Ty Comic'
    },
    container: {
        url: 'https://ungtycomicsvip.com/ba-tong-vuong-phi-lat-xe-chi-nam.html',
        id: '/ba-tong-vuong-phi-lat-xe-chi-nam.html',
        title: 'Bá Tổng Vương Phi Lật Xe Chỉ Nam',
    },
    child: {
        id: '/ba-tong-vuong-phi-lat-xe-chi-nam/chap-176.html',
        title: 'Chap 176'
    },
    entry: {
        index: 1,
        size: 205_902,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());