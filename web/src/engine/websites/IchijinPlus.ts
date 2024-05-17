import { Tags } from '../Tags';
import icon from './IchijinPlus.webp';
import ToCoronaEx from './ToCoronaEx';
export default class extends ToCoronaEx {
    public constructor() {
        super('ichijin-plus', '一迅プラス (Ichijin Plus)', 'https://ichijin-plus.com', [Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official], 'https://api.ichijin-plus.com', 'GGXGejnSsZw-IxHKQp8OQKHH-NDItSbEq5PU0g2w1W4=');
    }
    public override get Icon() {
        return icon;
    }
}