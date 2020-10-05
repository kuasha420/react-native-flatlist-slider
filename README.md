# React Native FlatList Slider

[![Star IT Ltd](https://staritltd.com/wp-content/uploads/2019/10/Web_Logo_of_Star_IT_158x80.png)](https://staritltd.com)

🔥 A Fast and Flexible Image Slider for React Native. It has lots of customization options and only uses Core React Native Components. Zero dependency! 🔥

- Only uses core React & React Native exports. 🚀
- Written as functional component using hooks. 🪝
- Tons of customization options. 👗
- Written on TypeScript. 🔵
- Supports Web (react-native-web). 🌞

## Installation

Install with your favorite package manager.

Using Yarn:

```
yarn add @kuasha420/react-native-flatlist-slider
```

Using NPM:

```
npm i @kuasha420/react-native-flatlist-slider
```

## Usage

Just import the `FlatListSlider` component from the library and pass some slider images. All Props are optional and has a sensible default (Except images, because you know...).

```tsx
import { FlatListSlider } from '@kuasha420/react-native-flatlist-slider';

// Plain array with image URLs
const images = [
  'https://picsum.photos/seed/picsum1/200/300',
  'https://picsum.photos/seed/picsum2/200/300',
  'https://picsum.photos/seed/picsum3/200/300',
];

// Local Assets using require syntax
const images = [
  require('../path/too/image1.png'),
  require('../path/too/image2.png'),
  require('../path/too/image3.png'),
];

// Or a mix of both!
const images = [
  require('../path/too/image1.png'),
  'https://picsum.photos/seed/picsum2/200/300',
  require('../path/too/image3.png'),
];

export const App: React.FC<Props> = (props) => {
  return <FlatListSlider images={images} />;
};
```

## Props

### Available Props (All Optional)

NOTE: If you are consuming the package in a TypeScript project, you'll get IntelliSense (autocomplete) of all the props with JSDoc Descriptions and type safety.

```ts
interface FlatListSliderProps {
  width: 'window' | number;
  preAppliedSpacing: number;
  images: Array<string | number | ImageURISource>;
  aspectRatio: number;
  resizeMode: ImageResizeMode;
  style: ViewStyle;
  duration: number;
  animated: boolean;
  showIndicator: boolean;
  indicatorSize: number;
  indicatorColor: string;
  indicatorActiveColor: string;
  indicatorShape: 'circle' | 'square' | 'rectangle' | 'line';
  pressable: boolean;
  onPressSlide: (index: number, event: GestureResponderEvent) => void;
}
```

### Default Values

```ts
const defaultProps: FlatListSliderProps = {
  width: 'window',
  preAppliedSpacing: 0,
  aspectRatio: 1.78,
  resizeMode: 'contain',
  images: [],
  style: {},
  duration: 3000,
  animated: true,
  showIndicator: true,
  indicatorSize: 15,
  indicatorColor: '#111',
  indicatorActiveColor: '#fff',
  indicatorShape: 'circle',
  pressable: false,
  onPressSlide: (index, event) => (__DEV__ ? console.log({ index, event }) : console.log(index)),
};
```

## License

This package is licensed under the MIT License.

## Contribution

Any kind of contribution is welcome. Thanks!
