import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'scarmanga',
        title: 'ScarManga'
    },
    container: {
        url: 'https://scarmanga.com/series/i-have-a-dragon-in-my-body/',
        id: '/series/i-have-a-dragon-in-my-body/',
        title: 'I Have a Dragon in My Body'
    },
    child: {
        id: '/i-have-a-dragon-in-my-body-chapter-630/',
        title: 'الفصل 630'
    },
    entry: {
        index: 0,
        size: 1_925_572,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());