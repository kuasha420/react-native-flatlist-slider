import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  GestureResponderEvent,
  Image,
  ImageResizeMode,
  ImageSourcePropType,
  ImageStyle,
  ImageURISource,
  ListRenderItemInfo,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';

type IndicatorShape = 'circle' | 'square' | 'rectangle' | 'line';

type WidthType = 'window' | number;

export interface FlatListSliderProps {
  /**
   * Width of the slider. Ideally this should be consistent
   * with the width of slider images and aspect ratio.
   */
  width: WidthType;
  /**
   * Only applicable when width is set to screen. ie. width='window'
   * horizontal margin/padding that is already applied to the slider.
   * ie. any margin on its parent container.
   * This value will be subtracted from window width.
   */
  preAppliedSpacing: number;
  /**
   * Array of images.
   * Can be a array of string (absolute path/remote urll),
   * or React Native image source(Local). Can also mix.
   * the require('') syntax is also supported.
   * See: https://reactnative.dev/docs/image.html#source
   */
  images: Array<string | number | ImageURISource>;
  /**
   * Aspect Ratio of the images.
   * All Images should have the same aspect ratio for best result
   */
  aspectRatio: number;
  /**
   * React Native Image Resize Mode for sliders
   */
  resizeMode: ImageResizeMode;
  /**
   * Style of the parent container
   */
  style: ViewStyle;
  /**
   * How long each slider stays on screen.
   */
  duration: number;
  /**
   * Whether transition to next slide is animated.
   */
  animated: boolean;
  /**
   * Whether to show pagination indicator
   */
  showIndicator: boolean;
  /**
   * Pagination indicator size
   */
  indicatorSize: number;
  /**
   * Pagination indicator color. For supported color formats
   * See: https://reactnative.dev/docs/colors
   */
  indicatorColor: string;
  /**
   * Pagination indicator active color. For supported color formats
   * See: https://reactnative.dev/docs/colors
   */
  indicatorActiveColor: string;
  /**
   * Shape of the pagination indicators.
   * Supported options: 'circle' | 'square' | 'rectangle' | 'line'
   */
  indicatorShape: IndicatorShape;
  /**
   * whether the slider images are pressable.
   * If true, pressing on the slider images calls the onPressSlide function
   * with index and event.
   */
  pressable: boolean;
  /**
   * the onPressSlider function has the following signature.
   * (index, event) => void.
   */
  onPressSlide: (index: number, event: GestureResponderEvent) => void;
}

type IndicatorShapeStyles = {
  [key in IndicatorShape]: ViewStyle;
};

interface SliderStyles {
  slide: ImageStyle;
  indicator: ViewStyle;
  badge: ViewStyle;
  active: ViewStyle;
}

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

export const FlatListSlider: React.FC<Partial<FlatListSliderProps>> = (props) => {
  const p = useMemo(() => ({ ...defaultProps, ...props }), [props]);

  const { width: windowWidth } = useWindowDimensions();

  const [current, setCurrent] = useState(0);

  const width = useMemo(
    () => (p.width === 'window' ? windowWidth - p.preAppliedSpacing : p.width),
    [p.preAppliedSpacing, p.width, windowWidth]
  );

  const styles: SliderStyles = useMemo(
    () => ({
      slide: {
        width: width,
        height: width / p.aspectRatio,
        resizeMode: p.resizeMode,
      },
      indicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
      },
      badge: {
        marginHorizontal: 3,
        backgroundColor: p.indicatorColor,
        height: p.indicatorSize,
      },
      active: {
        backgroundColor: p.indicatorActiveColor,
      },
    }),
    [p.aspectRatio, p.indicatorActiveColor, p.indicatorColor, p.indicatorSize, p.resizeMode, width]
  );

  const indicatorShapes: IndicatorShapeStyles = useMemo(
    () => ({
      circle: {
        width: p.indicatorSize,
        borderRadius: p.indicatorSize / 2,
      },
      square: {
        width: p.indicatorSize,
      },
      rectangle: {
        width: p.indicatorSize * 1.5,
      },
      line: {
        width: p.indicatorSize * 1.5,
        height: p.indicatorSize * 0.5,
      },
    }),
    [p.indicatorSize]
  );

  const images = useMemo<ImageSourcePropType[]>(
    () => p.images.map((image) => (typeof image === 'string' ? { uri: image } : image)),
    [p.images]
  );

  const sliderRef = useRef<FlatList<ImageSourcePropType>>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      if (!sliderRef.current) {
        return;
      }
      if (images.length - 1 === current) {
        return sliderRef.current?.scrollToOffset({
          animated: true,
          offset: 0,
        });
      }
      sliderRef.current?.scrollToOffset({
        animated: true,
        offset: (styles.slide.width as number) * (current + 1),
      });
    }, p.duration);
    return () => {
      clearTimeout(id);
    };
  }, [current, p.animated, p.duration, images.length, styles.slide.width]);

  const renderSlide = (item: ListRenderItemInfo<ImageSourcePropType>) => {
    if (p.pressable) {
      return (
        <TouchableOpacity onPress={(e) => p.onPressSlide(item.index, e)}>
          <Image style={styles.slide} source={item.item} />
        </TouchableOpacity>
      );
    }
    return <Image style={styles.slide} source={item.item} />;
  };

  return (
    <View style={p.style}>
      <FlatList
        ref={sliderRef}
        data={images}
        renderItem={renderSlide}
        keyExtractor={(_i, e) => e.toString()}
        horizontal={true}
        pagingEnabled={true}
        decelerationRate="fast"
        bounces={false}
        removeClippedSubviews={true}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        onScroll={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width
          );
          if (current !== index) {
            setCurrent(index);
          }
        }}
        scrollEventThrottle={80}
        getItemLayout={(_data, index) => ({
          index: index,
          length: styles.slide.width as number,
          offset: (styles.slide.width as number) * index,
        })}
      />
      {p.showIndicator && (
        <View style={styles.indicator}>
          {p.images.map((_e, i) => (
            <TouchableOpacity
              onPress={() => {
                //sliderRef.current?.scrollToIndex({ index: i });
                sliderRef.current?.scrollToOffset({
                  animated: true,
                  offset: (styles.slide.width as number) * i,
                });
              }}
              key={i}
            >
              <View
                style={
                  i === current
                    ? [styles.badge, indicatorShapes[p.indicatorShape], styles.active]
                    : [styles.badge, indicatorShapes[p.indicatorShape]]
                }
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
