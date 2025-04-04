import { registerWebModule, NativeModule } from 'expo';

import { ExpoSwipeableItemModuleEvents } from './ExpoSwipeableItem.types';

class ExpoSwipeableItemModule extends NativeModule<ExpoSwipeableItemModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoSwipeableItemModule);
