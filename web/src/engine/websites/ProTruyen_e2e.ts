import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'protruyen',
        title: 'ProTruyen'
    },
    container: {
        url: 'https://protruyen.xyz/truyen-toi-khong-phai-quy-vuong.html',
        id: '/truyen-toi-khong-phai-quy-vuong.html',
        title: 'Tôi Không Phải Quỷ Vương'
    },
    child: {
        id: '/doc-toi-khong-phai-quy-vuong-chuong-175.html',
        title: 'Chapter 175'
    },
    entry: {
        index: 0,
        size: 231_811,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());