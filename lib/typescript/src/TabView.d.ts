import * as React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import type { Layout, LocaleDirection, NavigationState, PagerProps, Route, SceneRendererProps } from './types';
export type Props<T extends Route> = Omit<PagerProps, 'layoutDirection'> & {
    onIndexChange: (index: number) => void;
    navigationState: NavigationState<T>;
    renderScene: (props: SceneRendererProps & {
        route: T;
    }) => React.ReactNode;
    renderLazyPlaceholder?: (props: {
        route: T;
    }) => React.ReactNode;
    renderTabBar?: (props: SceneRendererProps & {
        navigationState: NavigationState<T>;
    }) => React.ReactNode;
    tabBarPosition?: 'top' | 'bottom';
    initialLayout?: Partial<Layout>;
    lazy?: ((props: {
        route: T;
    }) => boolean) | boolean;
    lazyPreloadDistance?: number;
    sceneContainerStyle?: StyleProp<ViewStyle>;
    direction?: LocaleDirection;
    pagerStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
};
export declare function TabView<T extends Route>({ onIndexChange, navigationState, renderScene, initialLayout, keyboardDismissMode, lazy, lazyPreloadDistance, onSwipeStart, onSwipeEnd, renderLazyPlaceholder, renderTabBar, sceneContainerStyle, pagerStyle, style, direction, swipeEnabled, tabBarPosition, animationEnabled, overScrollMode, }: Props<T>): React.JSX.Element;
//# sourceMappingURL=TabView.d.ts.map