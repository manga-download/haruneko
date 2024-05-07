import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'umetruyen',
        title: 'UmeTruyen'
    },
    container: {
        url: 'https://umetruyenvip.com/truyen-vet-do.html',
        id: '/truyen-vet-do.html',
        title: 'Vết Đỏ'
    },
    child: {
        id: '/truyen-vet-do/chapter-18',
        title: 'Chapter 18'
    },
    entry: {
        index: 0,
        size: 1_383_438,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());