import { NativeModule, requireNativeModule } from 'expo';

import { ExpoSwipeableItemModuleEvents } from './ExpoSwipeableItem.types';

declare class ExpoSwipeableItemModule extends NativeModule<ExpoSwipeableItemModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoSwipeableItemModule>('ExpoSwipeableItem');
