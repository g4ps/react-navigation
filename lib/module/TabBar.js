import * as React from 'react';
import { Animated, I18nManager, Platform, StyleSheet, View } from 'react-native';
import useLatestCallback from 'use-latest-callback';
import { TabBarIndicator } from './TabBarIndicator';
import { TabBarItem } from './TabBarItem';
import { useAnimatedValue } from './useAnimatedValue';
const Separator = _ref => {
  let {
    width
  } = _ref;
  return /*#__PURE__*/React.createElement(View, {
    style: {
      width
    }
  });
};
const getFlattenedTabWidth = style => {
  const tabStyle = StyleSheet.flatten(style);
  return tabStyle?.width;
};
const getFlattenedPaddingLeft = style => {
  const flattenStyle = StyleSheet.flatten(style);
  return flattenStyle ? flattenStyle.paddingLeft || flattenStyle.paddingHorizontal || 0 : 0;
};
const getFlattenedPaddingRight = style => {
  const flattenStyle = StyleSheet.flatten(style);
  return flattenStyle ? flattenStyle.paddingRight || flattenStyle.paddingHorizontal || 0 : 0;
};
const convertPaddingPercentToSize = (value, layout) => {
  switch (typeof value) {
    case 'number':
      return value;
    case 'string':
      if (value.endsWith('%')) {
        const width = parseFloat(value);
        if (Number.isFinite(width)) {
          return layout.width * (width / 100);
        }
      }
  }
  return 0;
};
const getComputedTabWidth = (index, layout, routes, scrollEnabled, tabWidths, flattenedWidth, flattenedPaddingLeft, flattenedPaddingRight, gap) => {
  if (flattenedWidth === 'auto') {
    return tabWidths[routes[index].key] || 0;
  }
  switch (typeof flattenedWidth) {
    case 'number':
      return flattenedWidth;
    case 'string':
      if (flattenedWidth.endsWith('%')) {
        const width = parseFloat(flattenedWidth);
        if (Number.isFinite(width)) {
          return layout.width * (width / 100);
        }
      }
  }
  if (scrollEnabled) {
    return layout.width / 5 * 2;
  }
  const gapTotalWidth = (gap ?? 0) * (routes.length - 1);
  const paddingTotalWidth = convertPaddingPercentToSize(flattenedPaddingLeft, layout) + convertPaddingPercentToSize(flattenedPaddingRight, layout);
  return (layout.width - gapTotalWidth - paddingTotalWidth) / routes.length;
};
const getMaxScrollDistance = (tabBarWidth, layoutWidth) => tabBarWidth - layoutWidth;
const getTranslateX = (scrollAmount, maxScrollDistance, direction) => Animated.multiply(Platform.OS === 'android' && direction === 'rtl' ? Animated.add(maxScrollDistance, Animated.multiply(scrollAmount, -1)) : scrollAmount, direction === 'rtl' ? 1 : -1);
const getTabBarWidth = _ref2 => {
  let {
    navigationState,
    layout,
    gap,
    scrollEnabled,
    flattenedTabWidth,
    flattenedPaddingLeft,
    flattenedPaddingRight,
    tabWidths
  } = _ref2;
  const {
    routes
  } = navigationState;
  const paddingsWidth = Math.max(0, convertPaddingPercentToSize(flattenedPaddingLeft, layout) + convertPaddingPercentToSize(flattenedPaddingRight, layout));
  return routes.reduce((acc, _, i) => acc + (i > 0 ? gap ?? 0 : 0) + getComputedTabWidth(i, layout, routes, scrollEnabled, tabWidths, flattenedTabWidth, flattenedPaddingLeft, flattenedPaddingRight, gap), paddingsWidth);
};
const normalizeScrollValue = _ref3 => {
  let {
    layout,
    navigationState,
    gap,
    scrollEnabled,
    tabWidths,
    value,
    flattenedTabWidth,
    flattenedPaddingLeft,
    flattenedPaddingRight,
    direction
  } = _ref3;
  const tabBarWidth = getTabBarWidth({
    layout,
    navigationState,
    tabWidths,
    gap,
    scrollEnabled,
    flattenedTabWidth,
    flattenedPaddingLeft,
    flattenedPaddingRight
  });
  const maxDistance = getMaxScrollDistance(tabBarWidth, layout.width);
  const scrollValue = Math.max(Math.min(value, maxDistance), 0);
  if (Platform.OS === 'android' && direction === 'rtl') {
    // On Android, scroll value is not applied in reverse in RTL
    // so we need to manually adjust it to apply correct value
    return maxDistance - scrollValue;
  }
  return scrollValue;
};
const getScrollAmount = _ref4 => {
  let {
    layout,
    navigationState,
    gap,
    scrollEnabled,
    flattenedTabWidth,
    tabWidths,
    flattenedPaddingLeft,
    flattenedPaddingRight,
    direction
  } = _ref4;
  const paddingInitial = direction === 'rtl' ? convertPaddingPercentToSize(flattenedPaddingRight, layout) : convertPaddingPercentToSize(flattenedPaddingLeft, layout);
  const centerDistance = Array.from({
    length: navigationState.index + 1
  }).reduce((total, _, i) => {
    const tabWidth = getComputedTabWidth(i, layout, navigationState.routes, scrollEnabled, tabWidths, flattenedTabWidth, flattenedPaddingLeft, flattenedPaddingRight, gap);

    // To get the current index centered we adjust scroll amount by width of indexes
    // 0 through (i - 1) and add half the width of current index i
    return total + (i > 0 ? gap ?? 0 : 0) + (navigationState.index === i ? tabWidth / 2 : tabWidth);
  }, paddingInitial);
  const scrollAmount = centerDistance - layout.width / 2;
  return normalizeScrollValue({
    layout,
    navigationState,
    tabWidths,
    value: scrollAmount,
    gap,
    scrollEnabled,
    flattenedTabWidth,
    flattenedPaddingLeft,
    flattenedPaddingRight,
    direction
  });
};
const getLabelTextDefault = _ref5 => {
  let {
    route
  } = _ref5;
  return route.title;
};
const getAccessibleDefault = _ref6 => {
  let {
    route
  } = _ref6;
  return typeof route.accessible !== 'undefined' ? route.accessible : true;
};
const getAccessibilityLabelDefault = _ref7 => {
  let {
    route
  } = _ref7;
  return typeof route.accessibilityLabel === 'string' ? route.accessibilityLabel : typeof route.title === 'string' ? route.title : undefined;
};
const renderIndicatorDefault = props => /*#__PURE__*/React.createElement(TabBarIndicator, props);
const getTestIdDefault = _ref8 => {
  let {
    route
  } = _ref8;
  return route.testID;
};

// How many items measurements should we update per batch.
// Defaults to 10, since that's whats FlatList is using in initialNumToRender.
const MEASURE_PER_BATCH = 10;
export function TabBar(_ref9) {
  let {
    getLabelText = getLabelTextDefault,
    getAccessible = getAccessibleDefault,
    getAccessibilityLabel = getAccessibilityLabelDefault,
    getTestID = getTestIdDefault,
    renderIndicator = renderIndicatorDefault,
    gap = 0,
    scrollEnabled,
    jumpTo,
    navigationState,
    position,
    activeColor,
    bounces,
    contentContainerStyle,
    inactiveColor,
    indicatorContainerStyle,
    indicatorStyle,
    labelStyle,
    onTabLongPress,
    onTabPress,
    pressColor,
    pressOpacity,
    renderBadge,
    renderIcon,
    renderLabel,
    direction = I18nManager.getConstants().isRTL ? 'rtl' : 'ltr',
    renderTabBarItem,
    style,
    tabStyle,
    layout: propLayout,
    testID,
    android_ripple
  } = _ref9;
  const [layout, setLayout] = React.useState(propLayout ?? {
    width: 0,
    height: 0
  });
  const [tabWidths, setTabWidths] = React.useState({});
  const flatListRef = React.useRef(null);
  const isFirst = React.useRef(true);
  const scrollAmount = useAnimatedValue(0);
  const measuredTabWidths = React.useRef({});
  const {
    routes
  } = navigationState;
  const flattenedTabWidth = getFlattenedTabWidth(tabStyle);
  const isWidthDynamic = flattenedTabWidth === 'auto';
  const flattenedPaddingRight = getFlattenedPaddingRight(contentContainerStyle);
  const flattenedPaddingLeft = getFlattenedPaddingLeft(contentContainerStyle);
  const scrollOffset = getScrollAmount({
    layout,
    navigationState,
    tabWidths,
    gap,
    scrollEnabled,
    flattenedTabWidth,
    flattenedPaddingLeft,
    flattenedPaddingRight,
    direction
  });
  const hasMeasuredTabWidths = Boolean(layout.width) && routes.slice(0, navigationState.index).every(r => typeof tabWidths[r.key] === 'number');
  React.useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (isWidthDynamic && !hasMeasuredTabWidths) {
      return;
    }
    if (scrollEnabled) {
      flatListRef.current?.scrollToOffset({
        offset: scrollOffset,
        animated: true
      });
    }
  }, [hasMeasuredTabWidths, isWidthDynamic, scrollEnabled, scrollOffset]);
  const handleLayout = e => {
    const {
      height,
      width
    } = e.nativeEvent.layout;
    setLayout(layout => layout.width === width && layout.height === height ? layout : {
      width,
      height
    });
  };
  const tabBarWidth = getTabBarWidth({
    layout,
    navigationState,
    tabWidths,
    gap,
    scrollEnabled,
    flattenedTabWidth,
    flattenedPaddingLeft,
    flattenedPaddingRight
  });
  const separatorsWidth = Math.max(0, routes.length - 1) * gap;
  const paddingsWidth = Math.max(0, convertPaddingPercentToSize(flattenedPaddingLeft, layout) + convertPaddingPercentToSize(flattenedPaddingRight, layout));
  const translateX = React.useMemo(() => getTranslateX(scrollAmount, getMaxScrollDistance(tabBarWidth, layout.width), direction), [direction, layout.width, scrollAmount, tabBarWidth]);
  const renderItem = React.useCallback(_ref10 => {
    let {
      item: route,
      index
    } = _ref10;
    const props = {
      key: route.key,
      position: position,
      route: route,
      navigationState: navigationState,
      getAccessibilityLabel: getAccessibilityLabel,
      getAccessible: getAccessible,
      getLabelText: getLabelText,
      getTestID: getTestID,
      renderBadge: renderBadge,
      renderIcon: renderIcon,
      renderLabel: renderLabel,
      activeColor: activeColor,
      inactiveColor: inactiveColor,
      pressColor: pressColor,
      pressOpacity: pressOpacity,
      onLayout: isWidthDynamic ? e => {
        measuredTabWidths.current[route.key] = e.nativeEvent.layout.width;

        // When we have measured widths for all of the tabs, we should updates the state
        // We avoid doing separate setState for each layout since it triggers multiple renders and slows down app
        // If we have more than 10 routes divide updating tabWidths into multiple batches. Here we update only first batch of 10 items.
        if (routes.length > MEASURE_PER_BATCH && index === MEASURE_PER_BATCH && routes.slice(0, MEASURE_PER_BATCH).every(r => typeof measuredTabWidths.current[r.key] === 'number')) {
          setTabWidths({
            ...measuredTabWidths.current
          });
        } else if (routes.every(r => typeof measuredTabWidths.current[r.key] === 'number')) {
          // When we have measured widths for all of the tabs, we should updates the state
          // We avoid doing separate setState for each layout since it triggers multiple renders and slows down app
          setTabWidths({
            ...measuredTabWidths.current
          });
        }
      } : undefined,
      onPress: () => {
        const event = {
          route,
          defaultPrevented: false,
          preventDefault: () => {
            event.defaultPrevented = true;
          }
        };
        onTabPress?.(event);
        if (event.defaultPrevented) {
          return;
        }
        jumpTo(route.key);
      },
      onLongPress: () => onTabLongPress?.({
        route
      }),
      labelStyle: labelStyle,
      style: tabStyle,
      // Calculate the deafult width for tab for FlatList to work
      defaultTabWidth: !isWidthDynamic ? getComputedTabWidth(index, layout, routes, scrollEnabled, tabWidths, getFlattenedTabWidth(tabStyle), getFlattenedPaddingRight(contentContainerStyle), getFlattenedPaddingLeft(contentContainerStyle), gap) : undefined,
      android_ripple
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, gap > 0 && index > 0 ? /*#__PURE__*/React.createElement(Separator, {
      width: gap
    }) : null, renderTabBarItem ? renderTabBarItem(props) : /*#__PURE__*/React.createElement(TabBarItem, props));
  }, [activeColor, android_ripple, gap, getAccessibilityLabel, getAccessible, getLabelText, getTestID, inactiveColor, isWidthDynamic, jumpTo, labelStyle, layout, navigationState, onTabLongPress, onTabPress, position, pressColor, pressOpacity, renderBadge, renderIcon, renderLabel, renderTabBarItem, routes, scrollEnabled, tabStyle, contentContainerStyle, tabWidths]);
  const keyExtractor = React.useCallback(item => item.key, []);
  const contentContainerStyleMemoized = React.useMemo(() => [styles.tabContent, scrollEnabled ? {
    width: tabBarWidth
  } : null, contentContainerStyle], [contentContainerStyle, scrollEnabled, tabBarWidth]);
  const handleScroll = React.useMemo(() => Animated.event([{
    nativeEvent: {
      contentOffset: {
        x: scrollAmount
      }
    }
  }], {
    useNativeDriver: true
  }), [scrollAmount]);
  const handleViewableItemsChanged = useLatestCallback(_ref11 => {
    let {
      changed
    } = _ref11;
    if (routes.length <= MEASURE_PER_BATCH) {
      return;
    }
    // Get next vievable item
    const item = changed[changed.length - 1];
    const index = item?.index || 0;
    if (item.isViewable && (index % 10 === 0 || index === navigationState.index || index === routes.length - 1)) {
      setTabWidths({
        ...measuredTabWidths.current
      });
    }
  });
  return /*#__PURE__*/React.createElement(Animated.View, {
    onLayout: handleLayout,
    style: [styles.tabBar, style]
  }, /*#__PURE__*/React.createElement(Animated.View, {
    pointerEvents: "none",
    style: [styles.indicatorContainer, scrollEnabled ? {
      transform: [{
        translateX
      }]
    } : null, scrollEnabled ? {
      width: tabBarWidth
    } : null, indicatorContainerStyle]
  }, renderIndicator({
    position,
    layout,
    navigationState,
    jumpTo,
    direction,
    width: isWidthDynamic ? 'auto' : Math.max(0, (tabBarWidth - separatorsWidth - paddingsWidth) / routes.length),
    style: [indicatorStyle, {
      left: flattenedPaddingLeft,
      right: flattenedPaddingRight
    }],
    getTabWidth: i => getComputedTabWidth(i, layout, routes, scrollEnabled, tabWidths, flattenedTabWidth, flattenedPaddingRight, flattenedPaddingLeft, gap),
    gap
  })), /*#__PURE__*/React.createElement(View, {
    style: styles.scroll
  }, /*#__PURE__*/React.createElement(Animated.FlatList, {
    data: routes,
    keyExtractor: keyExtractor,
    horizontal: true,
    accessibilityRole: "tablist",
    keyboardShouldPersistTaps: "handled",
    scrollEnabled: scrollEnabled,
    bounces: bounces,
    initialNumToRender: MEASURE_PER_BATCH,
    onViewableItemsChanged: handleViewableItemsChanged,
    alwaysBounceHorizontal: false,
    scrollsToTop: false,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    automaticallyAdjustContentInsets: false,
    overScrollMode: "never",
    contentContainerStyle: contentContainerStyleMemoized,
    scrollEventThrottle: 16,
    renderItem: renderItem,
    onScroll: handleScroll,
    ref: flatListRef,
    testID: testID
  })));
}
const styles = StyleSheet.create({
  scroll: {
    overflow: Platform.select({
      default: 'scroll',
      web: undefined
    })
  },
  tabBar: {
    backgroundColor: '#2196f3',
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
      width: 0
    },
    zIndex: 1
  },
  tabContent: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  indicatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});
//# sourceMappingURL=TabBar.js.map