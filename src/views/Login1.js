import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import * as colors from '../assets/css/Colors';
import {
  Container,
  Icon,
  Spinner,
  Content,
  H2,
  Row,
  Col,
  Button,
} from 'native-base';
import Snackbar from 'react-native-snackbar';
import {
  api_url,
  login,
  height_40,
  login_image,
  logo,
} from '../config/Constants';
import {StatusBar, Loader} from '../components/GeneralComponents';
import {connect} from 'react-redux';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
} from '../actions/LoginActions';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationActions, StackActions} from 'react-navigation';

class Login1 extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      email: '',
      password: '',
      validation: true,
    };
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  login = async () => {
    Keyboard.dismiss();
    await this.checkValidate();
    if (this.state.validation) {
      this.props.serviceActionPending();
      // alert('axios')
      // await axios({
      // axios({
      //   method: 'post',
      //   url: api_url + login,
      //   data: { email: this.state.email, password: this.state.password}
      // })
      fetch(api_url + login, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          // console.log('res',response)
          // console.log('res',response)
          // await this.props.serviceActionSuccess(response.data);
          // await this.saveData();
          this.props.serviceActionSuccess(response);
          this.saveData();
        })
        .catch((error) => {
          alert('Error');
          this.props.serviceActionError(error);
        });
    }
  };

  checkValidate() {
    if (this.state.email == '' || this.state.password == '') {
      this.state.validation = false;
      this.showSnackbar('Please fill all the fields.');
      return true;
    } else {
      this.state.validation = true;
      return true;
    }
  }

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

  home = () => {
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
  };

  register = () => {
    this.props.navigation.navigate('Register');
  };

  forgot = () => {
    this.props.navigation.navigate('Forgot');
  };

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
        <View style={styles.email_container}>
          <Text
            style={{
              fontFamily:'SFUIDisplay-Light',              color: colors.theme_bg,
              fontSize: 15,
              fontWeight: 'bold',
              marginLeft: 5,
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
          style={styles.forgot_password_container}
          onPress={() => {
            this.props.navigation.navigate('Forgot');
          }}>
          <Text
            style={{fontFamily:'SFUIDisplay-Light',color: colors.theme_bg, fontWeight: 'bold', fontSize: 15}}>
            Forgot Password ?
          </Text>
        </TouchableOpacity>

        <View>
          <TouchableOpacity onPress={this.login} style={styles.btnLogin}>
            <Text
              style={{
                textAlign: 'center',
                color: '#fff',
                padding: 15,
                fontWeight: 'bold',
                fontSize: 15,fontFamily:'SFUIDisplay-Light',
              }}>
              LOGIN
            </Text>
          </TouchableOpacity>
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text style={{fontFamily:'SFUIDisplay-Light',color: colors.theme_text, fontWeight: 'bold'}}>
              OR
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              marginTop: 20,
              flexDirection: 'row',
            }}>
            <Text style={{fontFamily:'SFUIDisplay-Medium',color: colors.theme_text}}>
              Don`t have an account ?
            </Text>
            <TouchableOpacity onPress={this.props.handler}>
              <Text style={{fontFamily:'SFUIDisplay-Light',color: colors.theme_bg, fontWeight: 'bold'}}>
                {' '}
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Content>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.login.isLoding,
    error: state.login.error,
    data: state.login.data,
    message: state.login.message,
    status: state.login.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
  serviceActionPending: () => dispatch(serviceActionPending()),
  serviceActionError: (error) => dispatch(serviceActionError(error)),
  serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login1);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // width:'100%',
    height: 500,
    marginHorizontal: 20,
    // backgroundColor:colors.theme_bg
  },
  email_container: {
    marginTop: 30,
    // flexDirection:'row'
  },
  password_container: {
    marginTop: 10,
  },
  forgot_password_container: {
    marginTop: 15,
    width: '100%',
    // height:55,
    alignItems: 'flex-end',
  },
  btnLogin: {
    backgroundColor: colors.theme_bg,
    borderRadius: 25,
    marginTop: 20,
    // width:300
    width: '100%',
  },
});
