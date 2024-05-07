import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hastateam',
        title: 'Hasta Team'
    },
    container: {
        url: 'https://reader.hastateam.com/comics/yotsuba',
        id: 'yotsuba',
        title: 'Yotsuba&!'
    },
    child: {
        id: '/read/yotsuba/it/vol/16/ch/108',
        title: 'Vol.16 Ch.108 - Yotsuba & l’escursione (parte 1)'
    },
    entry: {
        index: 1,
        size: 612_050,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());