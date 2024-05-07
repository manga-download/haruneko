import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'blogtruyenmoi',
        title: 'BlogTruyenMoi'
    },
    container: {
        url: 'https://blogtruyenmoi.com/31940/arika-cua-toi',
        id: '/31940/arika-cua-toi',
        title: 'Arika của tôi'
    },
    child: {
        id: '/c867145/arika-cua-toi-chuong-50-gia-tri-cua-chi-rieng-minh-toi',
        title: 'Chương 50: Giá trị của chỉ riêng mình tôi'
    },
    entry: {
        index: 2,
        size: 762_322,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
