import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'allhentai',
        title: 'AllHentai'
    },
    container: {
        url: 'https://z.ahen.me/nochiu_ona_nimfomanka',
        id: '/nochiu_ona_nimfomanka',
        title: 'Ночью она нимфоманка'
    },
/*  Irrelevant tests since we need to be logged
    child: {
        id: '/nochiu_ona_nimfomanka/vol1/4',
        title: '2 - 4',
    },
    entry: {
        index: 0,
        size: 291_243,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());