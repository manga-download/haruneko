import { Tags } from '../Tags';
import icon from './ManhuaTai.webp';
import MHKX, { type MhxkInfos } from './decorators/MHXK';
import * as Common from './decorators/Common';

@Common.ImageAjax(true)
export default class extends MHKX {
    public constructor() {
        const product: MhxkInfos = {
            id: '2',
            name: 'mht',
            platform: 'pc'
        };

        super('manhuatai', `ManhuaTai`, 'https://www.manhuatai.com', product, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}