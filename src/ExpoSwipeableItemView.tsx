import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoSwipeableItemViewProps } from './ExpoSwipeableItem.types';

const NativeView: React.ComponentType<ExpoSwipeableItemViewProps> =
  requireNativeView('ExpoSwipeableItem');

export default function ExpoSwipeableItemView(props: ExpoSwipeableItemViewProps) {
  return <NativeView {...props} />;
}
