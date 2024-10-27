import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'soudongman',
        title: '斗罗大陆 (SouDongMan)'
    },
    container: {
        url: 'https://www.soudongman.com/108224/',
        id: '108224',
        title: '无敌学霸系统'
    },
    child: {
        id: 'di303hua-1694658870',
        title: '第303话 我要当圣使'
    },
    entry: {
        index: 0,
        size: 238_698,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();