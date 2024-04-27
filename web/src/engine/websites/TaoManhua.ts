import { Tags } from '../Tags';
import icon from './TaoManhua.webp';
import MHKX, { type MhkxInfos } from './decorators/MHKX';
import * as Common from './decorators/Common';

@Common.ImageAjax(true)
export default class extends MHKX {
    public constructor() {
        const product: MhkxInfos = {
            id: '3',
            name: 'smh',
            platform: 'pc'
        };

        super('taomanhua', `神漫画 (Tao Manhua)`, 'https://www.taomanhua.com', product, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}