import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

import { Explore } from './screens/Explore';
import { Home } from './screens/Home';
import { Insights } from './screens/Insights';
import { NotFound } from './screens/NotFound';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        headerShown: false,
        title: 'Overview',
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="speedometer" color={color} />,
      },
    },
    Explore: {
      screen: Explore,
      options: {
        headerShown: false,
        title: 'Workload',
        tabBarIcon: ({ color }) => (
          <IconSymbol size={28} name="list.bullet.rectangle" color={color} />
        ),
      },
    },
    Insights: {
      screen: Insights,
      options: {
        headerShown: false,
        title: 'Insights',
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="sparkles" color={color} />,
      },
    },
  },
  screenOptions: {
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarBackground: TabBarBackground,
    tabBarStyle: Platform.select({
      ios: {
        // Use a transparent background on iOS to show the blur effect
        possition: 'absolute',
      },
      default: {},
    }),
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        headerShown: false,
      },
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: '404',
      },
      linking: {
        path: '*',
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
