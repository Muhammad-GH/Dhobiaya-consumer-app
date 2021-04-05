import React, {Fragment} from 'react';
import {Image} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import {fromRight} from 'react-navigation-transitions';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

/* Screens */
import Splash from './src/views/Splash';
import Home from './src/views/Home';
import Product from './src/views/Product';
import Promo from './src/views/Promo';
import MyOrders from './src/views/MyOrders';
import OrderDetails from './src/views/OrderDetails';
import Cart from './src/views/Cart';
import Profile from './src/views/Profile';
import More from './src/views/More';
import Address from './src/views/Address';
import AddressList from './src/views/AddressList';
import Payment from './src/views/Payment';
import GetStart from './src/views/GetStarted';
import LoginSignUp from './src/views/Login&SignUp';
import Login from './src/views/Login';
import Register from './src/views/Register';
import Faq from './src/views/Faq';
import FaqDetails from './src/views/FaqDetails';
import PrivacyPolicy from './src/views/PrivacyPolicy';
import Forgot from './src/views/Forgot';
import Otp from './src/views/Otp';
import Reset from './src/views/Reset';
import Logout from './src/views/Logout';
import AsyncStorage from '@react-native-community/async-storage';
import {theme_fgL} from "./src/assets/css/Colors";

const TabNavigator = createMaterialBottomTabNavigator(
  {
    HomeTab: {
      screen: Product,
      navigationOptions: {
        // tabBarVisible:false,
        tabBarLabel: 'Home',
        tabBarIcon: ({tintColor}) => {
          return (
            <Image
              source={require('./src/assets/homea.png')}
              style={{width: 25, height: 20,tintColor}}
            />
          );
        },
      },
    },
    MyOrders: {
      screen: MyOrders,
      navigationOptions: {
        tabBarLabel: 'My Orders',
        tabBarIcon: ({tintColor}) => {
          return (
            <Image
              source={require('./src/assets/ordera.png')}
              style={{width: 25, height: 20,tintColor}}
            />
          );
        },
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({tintColor}) => {
          return (
            <Image
              source={require('./src/assets/usera.png')}
              style={{width: 20, height: 20,tintColor}}
            />
          );
        },
      },
    },
    More: {
      screen: More,
      navigationOptions: {
        tabBarLabel: 'More',
        tabBarIcon: ({tintColor}) => {
          return (
            <Image
              source={require('./src/assets/morea.png')}
              style={{width: 20, height: 20,tintColor}}
            />
          );
        },
      },
    },
  },
  {
    initialRouteName: 'HomeTab',
    activeColor: '#FFFFFF',
    inactiveTintColor: '#FFFFFF',
    inactiveColor: '#86D9F8',
    shifting: false,
    barStyle: {backgroundColor: '#00aeef'},
    tabBarOptions: {
      activeTintColor: '#FFF',
    },
    tabBarLabelActive: {
      color: '#fff',
    },
    // barStyle: { backgroundColor: '#008678' },
  },
);


const AppNavigator = createStackNavigator(
  {
    Splash: {screen: Splash},
    Home:Home,
    Cart: {screen: Cart},
    Dashboard:TabNavigator,
    Address: {screen: Address},
    AddressList: {screen: AddressList},
    Payment: {screen: Payment},
    Promo: {screen: Promo},
    OrderDetails: {screen: OrderDetails},
    GetStart: {screen: GetStart},
    LoginSignUp: {screen: LoginSignUp},
    Login: {screen: Login},
    Register: {screen: Register},
    Faq: {screen: Faq},
    FaqDetails: {screen: FaqDetails},
    PrivacyPolicy: {screen: PrivacyPolicy},
    Forgot: {screen: Forgot},
    Otp: {screen: Otp},
    Reset: {screen: Reset},
    Logout: {screen: Logout},
  },
  {
    initialRouteName: 'Splash',
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
    transitionConfig: () => fromRight(500),
  },
);


export default createAppContainer(AppNavigator);
