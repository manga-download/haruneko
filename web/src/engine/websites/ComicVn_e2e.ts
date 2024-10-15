import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'comicvn',
        title: 'ComicVn'
    },
    container: {
        url: 'https://comicvn2.com/hoa-vo-co-su-670dbd0c43a81739310b9597.html',
        id: '/hoa-vo-co-su-670dbd0c43a81739310b9597.html',
        title: 'Hỏa Võ Cố Sự'
    },
    child: {
        id: '/hoa-vo-co-su/chapter-1-670dbd15f61d243e99169053.html',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 728_133,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());