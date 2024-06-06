import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'lewdmanhwa',
        title: 'LewdManhwa'
    },
    container: {
        url: 'https://lewdmanhwa.com/webtoon/island-puzzle/',
        id: '/webtoon/island-puzzle/',
        title: 'Island Puzzle',
    },
    child: {
        id: '/webtoon/island-puzzle/chapter/0',
        title: 'Chapter 0-Prologue'
    },
    entry: {
        index: 0,
        size: 27_130,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());