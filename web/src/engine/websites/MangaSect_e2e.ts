import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangasect',
        title: 'MangaSect'
    },
    container: {
        url: 'https://mangasect.com/manga/shen-yin-wang-zuo/298',
        id: '/manga/shen-yin-wang-zuo/298',
        title: 'Shen Yin Wang Zuo'
    },
    child: {
        id: '/manga/shen-yin-wang-zuo/chapter-310/97235',
        title: 'Chapter 310'
    },
    entry: {
        index: 1,
        size: 200_749,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());