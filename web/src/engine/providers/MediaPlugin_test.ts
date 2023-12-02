import { MediaContainer, type MediaItem } from './MediaPlugin';

class MediaContainerMock extends MediaContainer<MediaItem> {
    public override async Update(): Promise<void> {}
}

describe('Array<MediaContainer<MediaItem>>', () => {

    describe('distinct()', () => {

        test('Should remove duplicate entries', async () => {
            const actual = [
                new MediaContainerMock('001', 'A'),
                new MediaContainerMock('002', 'B'),
                new MediaContainerMock('001', 'C'),
                new MediaContainerMock('003', 'D'),
                new MediaContainerMock('004', 'E'),
                new MediaContainerMock('004', 'F'),
                new MediaContainerMock('004', 'G'),
                new MediaContainerMock('005', 'H'),
                new MediaContainerMock('003', 'I'),
            ].distinct().map(_ => _.Title);

            expect(actual).toStrictEqual(['A', 'B', 'D', 'E', 'H']);
        });
    });
});