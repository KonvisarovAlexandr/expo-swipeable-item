import * as React from 'react';

import { ExpoSwipeableItemViewProps } from './ExpoSwipeableItem.types';

export default function ExpoSwipeableItemView(props: ExpoSwipeableItemViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
