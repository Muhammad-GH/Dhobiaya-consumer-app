import React, {Component} from 'react';
import {View, StyleSheet, Alert, ImageBackground} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import {api_url, logo, product, service , settings} from '../config/Constants';
import * as colors from '../assets/css/Colors';
import {Image, StatusBar, Loader} from '../components/GeneralComponents';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
} from '../actions/SplashActions';
import {
  serviceActionPending as homeActionPending,
  serviceActionError as homeActionError,
  serviceActionSuccess as homeActionSuccess,
} from '../actions/HomeActions';
import {
  serviceActionPending as productActionPending,
  serviceActionError as productActionError,
  serviceActionSuccess as productActionSuccess,
  productListReset
} from '../actions/ProductActions';
import NetInfo from '@react-native-community/netinfo';

// import { serviceActionPending, serviceActionError,  } from '../actions/HomeActions';

class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connection: true,
    };
  }

  componentDidMount() {
    this.CheckConnectivity();
    this.Service();
    this.Product();
  }

  CheckConnectivity = () => {
    NetInfo.fetch().then(async (state) => {
      if (state.isConnected) {
        await this.home();
        await this.settings();
      } else {
        Alert.alert(
          'Seems that you are Offline! Please connect your Internet in order to you use  Dhobi Aya App.',
        );
      }
    });
  };

  Product = async () => {
    this.props.productActionPending();
    await axios({
      method: 'post',
      url: api_url + product,
      data: {service_id: 1},
    })
      .then(async (response) => {
        await this.props.productActionSuccess(response.data);
      })
      .catch((error) => {
        this.props.productActionError(error);
      });
  };

  Service = async () => {
    await axios({
      method: 'get',
      url: api_url + service,
    })
      .then(async (response) => {
        await this.props.homeActionSuccess(response.data);
      })
      .catch((error) => {
        this.props.homeActionError(error);
      });
  };

  settings = async () => {
    this.props.serviceActionPending();
    await axios({
      method: 'get',
      url: api_url + settings,
    })
      .then(async (response) => {
        await this.props.serviceActionSuccess(response.data);
      })
      .catch((error) => {
        this.props.serviceActionError(error);
      });
  };

  home = async () => {
    // setTimeout(async () => {
    const user_id = await AsyncStorage.getItem('user_id');
    const customer_name = await AsyncStorage.getItem('customer_name');
    const hasSeen = await AsyncStorage.getItem('seen');
    if (user_id) {
      //  alert('Yes')
      global.id = user_id;
      global.customer_name = customer_name;
      this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          key: null,
          actions: [
            NavigationActions.navigate({
              routeName: 'Home',
            }),
          ],
        }),
      );
    } else {
      // global.id = '';
      //  alert('No')
      this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          key: null,
          actions: [
            NavigationActions.navigate({
              routeName: 'GetStart',
            }),
          ],
        }),
      );
    }
    // }, 2500);
  };

  render() {
    return (
      <ImageBackground
        source={require('../assets/splash2.png')}
        style={{width: '100%', height: '100%'}}>
        <StatusBar />
      </ImageBackground>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.splash.isLoding,
    error: state.splash.error,
    data: state.splash.data,
    message: state.splash.message,
    status: state.splash.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
  serviceActionPending: () => dispatch(serviceActionPending()),
  serviceActionError: (error) => dispatch(serviceActionError(error)),
  serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data)),
  productActionPending: () => dispatch(productActionPending()),
  productActionError: (error) => dispatch(productActionError(error)),
  productActionSuccess: (data) => dispatch(productActionSuccess(data)),
  homeActionPending: () => dispatch(homeActionPending()),
  homeActionError: (error) => dispatch(homeActionError(error)),
  homeActionSuccess: (data) => dispatch(homeActionSuccess(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.theme_bg,
  },
  image_view: {
    height: 225,
    width: 225,
  },
});
