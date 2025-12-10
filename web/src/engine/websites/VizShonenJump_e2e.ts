import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: ShonenJump : correct page number
new TestFixture({
    plugin: {
        id: 'vizshonenjump',
        title: 'Viz - Shonen Jump'
    },
    container: {
        url: 'https://www.viz.com/shonenjump/chapters/one-punch-man',
        id: '/shonenjump/chapters/one-punch-man',
        title: 'One-Punch Man'
    },
    child: {
        id: '/shonenjump/one-punch-man-chapter-1/chapter/4168?action=read',
        title: 'Ch. 1'
    },
    entry: {
        index: 4,
        size: 942_107,
        type: 'image/png'
    }
}).AssertWebsite();

// CASE : ShonenJump : incorrect page number
new TestFixture({
    plugin: {
        id: 'vizshonenjump',
        title: 'Viz - Shonen Jump'
    },
    container: {
        url: 'https://www.viz.com/shonenjump/chapters/jojos-bizarre-adventure-part-5',
        id: '/shonenjump/chapters/jojos-bizarre-adventure-part-5',
        title: 'JoJo’s Bizarre Adventure: Part 5--Golden Wind'
    },
    child: {
        id: '/shonenjump/jojos-bizarre-adventure-part-5-chapter-3/chapter/23088?action=read',
        title: 'Ch. 3'
    },
    entry: {
        index: 20,
        size: 184_560,
        type: 'image/png'
    }
}).AssertWebsite();

// CASE: VIZ
new TestFixture({
    plugin: {
        id: 'vizshonenjump',
        title: 'Viz - Shonen Jump'
    },
    container: {
        url: 'https://www.viz.com/vizmanga/chapters/the-kings-beast',
        id: '/vizmanga/chapters/the-kings-beast',
        title: 'The King’s Beast'
    },
    child: {
        id: '/vizmanga/the-kings-beast-chapter-1/chapter/35920?action=read',
        title: 'Ch. 1'
    },
    entry: {
        index: 1,
        size: 730_205,
        type: 'image/png'
    }
}).AssertWebsite();