import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'sugarlab',
        title: 'SugarLab'
    },
    container: {
        url: 'https://sugarlab.my.id/manga/jk-chan-and-her-male-classmates-mom/',
        id: '/manga/jk-chan-and-her-male-classmates-mom/',
        title: 'JK-chan and Her Male Classmate’s Mom'
    },
    child: {
        id: '/jk-chan-and-her-male-classmates-mom-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 1_874_657,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());