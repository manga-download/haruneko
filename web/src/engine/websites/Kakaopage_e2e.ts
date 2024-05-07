import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'kakaopage',
        title: 'Page Kakao (카카오페이지)'
    },
    container: {
        url: 'https://page.kakao.com/content/49361421',
        id: '49361421',
        title: '정령왕 엘퀴네스'
    },
    child: {
        id: '49402089',
        title: '1화'
    },
    entry: {
        index: 0,
        size: 65_661,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());