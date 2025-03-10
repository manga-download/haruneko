import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Plain Images
new TestFixture({
    plugin: {
        id: 'bontoon',
        title: 'Bontoon'
    },
    container: {
        url: 'https://www.bontoon.com/detail/bt_1110866',
        id: 'bt_1110866',
        title: 'Amis au Départ'
    },
    child: {
        id: '1',
        title: '1'
    },
    entry: {
        index: 0,
        size: 531_808,
        type: 'image/webp'
    }
}).AssertWebsite();

/*
// CASE: Scrambled Images
// need login

new TestFixture({
    plugin: {
        id: 'bontoon',
        title: 'Bontoon'
    },
    container: {
        url: 'https://www.bomtoon.com/detail/bt_1110998',
        id: 'bt_1110998',
        title: 'Off Track'
    },
    child: {
        id: '1',
        title: '1'
    },
    entry: {
        index: 0,
        size: 1_067_524,
        type: 'image/png'
    }
}).AssertWebsite();
*/