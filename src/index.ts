// Reexport the native module. On web, it will be resolved to ExpoSwipeableItemModule.web.ts
// and on native platforms to ExpoSwipeableItemModule.ts
export { default } from './ExpoSwipeableItemModule';
export { default as ExpoSwipeableItemView } from './ExpoSwipeableItemView';
export * from  './ExpoSwipeableItem.types';
