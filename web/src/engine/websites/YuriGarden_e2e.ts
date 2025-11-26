import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'yurigarden',
        title: 'YuriGarden'
    },
    container: {
        url: 'https://yurigarden.com/comic/797',
        id: '797',
        title: 'Tuyển tập PokeTaki cực gay!!!'
    },
    child: {
        id: '5634',
        title: 'Chapter 1 - CHỤP ĐỂU (My Sweet Megane)',
    },
    entry: {
        index: 1,
        size: 1_816_340,
        type: 'image/png'
    }
}).AssertWebsite();