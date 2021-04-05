import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  BackHandler,
  Keyboard,
} from 'react-native';
import * as colors from '../assets/css/Colors';
import {Container, Icon, Spinner, Content, H2, Row, Col} from 'native-base';
import {NavigationActions, StackActions} from 'react-navigation';
import Snackbar from 'react-native-snackbar';
import {api_url, register, height_40, logo} from '../config/Constants';
import {StatusBar, Loader} from '../components/GeneralComponents';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
} from '../actions/RegisterActions';
import AsyncStorage from '@react-native-community/async-storage';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      customer_name: '',
      phone_number: '',
      email: '',
      password: '',
      validation: true,
    };
  }

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick() {
    this.props.navigation.navigate('GetStart');
    return true;
  }

  home = () => {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Home',
          }),
        ],
      }),
    );
  };

  register = async () => {
    Keyboard.dismiss();
    await this.checkValidate();
    if (this.state.validation) {
      this.props.serviceActionPending();
      await axios({
        method: 'post',
        url: api_url + register,
        data: {
          customer_name: this.state.customer_name,
          phone_number: this.state.phone_number,
          email: this.state.email,
          password: this.state.password,
        },
      })
        .then(async (response) => {
          await this.props.serviceActionSuccess(response.data);
          await this.saveData();
        })
        .catch((error) => {
          this.props.serviceActionError(error);
        });
    }
  };

  saveData = async () => {
    if (this.props.status == 1) {
      try {
        await AsyncStorage.setItem('user_id', this.props.data.id.toString());
        await AsyncStorage.setItem(
          'customer_name',
          this.props.data.customer_name.toString(),
        );
        global.id = await this.props.data.id;
        global.customer_name = await this.props.data.customer_name;
        await this.home();
      } catch (e) {}
    } else {
      alert(this.props.message);
    }
  };

  checkValidate() {
    if (
      this.state.email == '' ||
      this.state.phone_number == '' ||
      this.state.password == '' ||
      this.state.customer_name == ''
    ) {
      this.state.validation = false;
      this.showSnackbar('Please fill all the fields.');
      return true;
    } else {
      this.state.validation = true;
      return true;
    }
  }

  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  render() {
    const {isLoding, error, data, message, status} = this.props;
    return (
      <Content contentContainerStyle={styles.container}>
        <View>
          <StatusBar />
        </View>
        <Loader visible={isLoding} />
        <View style={styles.username_container}>
          <Text
            style={{
              color: colors.theme_bg,
              fontSize: 15,
              fontWeight: 'bold',
              marginLeft: 5,
              fontFamily:'SFUIDisplay-Light',
            }}>
            User Name
          </Text>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <TextInput
              style={{
                marginLeft: 1,
                borderBottomWidth: 0.5,
                borderColor: '#dbd7d7',
                width: '90%',
                fontFamily:'SFUIDisplay-Light'

              }}
              placeholder="USERNAME"
              keyboardType="email-address"
              onChangeText={(TextInputValue) =>
                this.setState({customer_name: TextInputValue})
              }
            />
            <View
              style={{
                marginLeft: -10,
                marginTop: 10,
                borderBottomWidth: 0.5,
                borderBottomColor: '#dbd7d7',
                width: '10%',
              }}>
              {this.state.customer_name.length ? (
                <Icon
                  name="check"
                  type="Feather"
                  style={{color: colors.theme_bg, fontSize: 20}}
                />
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.phonenumber_container}>
          <Text
            style={{
              color: colors.theme_bg,
              fontSize: 15,
              fontWeight: 'bold',
              marginLeft: 5,fontFamily:'SFUIDisplay-Light',
            }}>
            Phone Number
          </Text>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <TextInput
              style={{
                marginLeft: 1,
                borderBottomWidth: 0.5,
                borderColor: '#dbd7d7',
                width: '90%',
                fontFamily:'SFUIDisplay-Light'

              }}
              placeholder="PHONE"
              keyboardType="phone-pad"
              onChangeText={(TextInputValue) =>
                this.setState({phone_number: TextInputValue})
              }
            />
            <View
              style={{
                marginLeft: -10,
                marginTop: 10,
                borderBottomWidth: 0.5,
                borderBottomColor: '#dbd7d7',
                width: '10%',
              }}>
              {this.state.phone_number.length ? (
                <Icon
                  name="check"
                  type="Feather"
                  style={{color: colors.theme_bg, fontSize: 20}}
                />
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.email_container}>
          <Text
            style={{
              color: colors.theme_bg,
              fontSize: 15,
              fontWeight: 'bold',
              marginLeft: 5,fontFamily:'SFUIDisplay-Light',
            }}>
            Email Address
          </Text>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <TextInput
              style={{
                marginLeft: 1,
                borderBottomWidth: 0.5,
                borderColor: '#dbd7d7',
                width: '90%',
                fontFamily:'SFUIDisplay-Light'

              }}
              placeholder="EMAIL ADDRESS"
              keyboardType="email-address"
              onChangeText={(TextInputValue) =>
                this.setState({email: TextInputValue})
              }
            />
            <View
              style={{
                marginLeft: -10,
                marginTop: 10,
                borderBottomWidth: 0.5,
                borderBottomColor: '#dbd7d7',
                width: '10%',
              }}>
              {this.state.email.length ? (
                <Icon
                  name="check"
                  type="Feather"
                  style={{color: colors.theme_bg, fontSize: 20}}
                />
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.password_container}>
          <Text
            style={{
              color: colors.theme_bg,
              fontSize: 15,
              fontWeight: 'bold',
              marginLeft: 5,fontFamily:'SFUIDisplay-Light',
            }}>
            Password
          </Text>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <TextInput
              style={{
                marginLeft: 1,
                borderBottomWidth: 0.5,
                borderColor: '#dbd7d7',
                width: '90%',
                fontFamily:'SFUIDisplay-Light'

              }}
              placeholder="PASSWORD"
              secureTextEntry={true}
              onChangeText={(TextInputValue) =>
                this.setState({password: TextInputValue})
              }
            />
            <View
              style={{
                marginLeft: -10,
                marginTop: 10,
                borderBottomWidth: 0.5,
                borderBottomColor: '#dbd7d7',
                width: '10%',
              }}>
              {this.state.password.length ? (
                <Icon
                  name="check"
                  type="Feather"
                  style={{color: colors.theme_bg, fontSize: 20}}
                />
              ) : null}
            </View>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={true ? 0.7 : 0.3}
          onPress={this.register}
          style={styles.btnSignup}>
          <Text
            style={{
              textAlign: 'center',
              color: '#fff',
              padding: 15,
              fontWeight: 'bold',
              fontSize: 15,fontFamily:'SFUIDisplay-Light',
            }}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </Content>
    );
  }
}

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    // width:'100%',
    height: 500,
    marginHorizontal: 20,
    // backgroundColor:colors.theme_bg
  },
  username_container: {
    marginTop: 30,
    // flexDirection:'row'
  },
  phonenumber_container: {
    marginTop: 30,
  },
  email_container: {
    marginTop: 30,
  },
  password_container: {
    marginTop: 30,
  },
  forgot_password_container: {
    width: '100%',
    marginTop: 15,
    alignItems: 'flex-end',
  },
  btnSignup: {
    backgroundColor: colors.theme_bg,
    borderRadius: 25,
    marginTop: 20,
    // width:300
    width: '90%',
  },
});
