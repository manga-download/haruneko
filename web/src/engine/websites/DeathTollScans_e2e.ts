import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'deathtollscans',
        title: 'DeathTollScans'
    },
    container: {
        url: 'https://reader.deathtollscans.net/series/a_diary_of_embellished_patches/',
        id: '/series/a_diary_of_embellished_patches/',
        title: 'A Diary of Embellished Patches'
    },
    child: {
        id: '/read/a_diary_of_embellished_patches/en/0/1/',
        title: '1st Story: Pond'
    },
    entry: {
        index: 0,
        size: 1_886_820,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());