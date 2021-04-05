import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  Image,
  BackHandler,
  Keyboard,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Button} from 'react-native-elements';
import {NavigationActions, StackActions} from 'react-navigation';
import {Icon} from 'native-base';
import Snackbar from 'react-native-snackbar';
import {api_url, register, height_40, logo} from '../config/Constants';
import {StatusBar, Loader} from '../components/GeneralComponents';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
} from '../actions/RegisterActions';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import InstagramLogin from 'react-native-instagram-login';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {AccessToken, LoginManager} from 'react-native-fbsdk';
const {height} = Dimensions.get('window');

class Register extends Component<Props> {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      customer_name: '',
      phone_number: '',
      email: '',
      password: '',
      validation: true,
      isError: false,
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
    this.props.navigation.navigate('Login');
    return true;
  }

  LoginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // const userInfo = await GoogleSignin.signInSilently();;
      // const currentUser = await GoogleSignin.getCurrentUser();
      // console.log('userInfo-------------->', currentUser.accessToken)
      // this.props.Google_Login(userInfo)
      const {user} = userInfo;
      alert(`Name: ${user.name}\nEmail: ${user.email}`);
      // console.log('accessToken-------------->', userInfo.accessToken)
      // this.setState({ userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('userInfo-------------->111');
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('userInfo-------------->222');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('userInfo-------------->333');
      } else {
        // some other error happened
        // this.props.navigation.navigate('Home')
        console.log('userInfo---------ELSE----->', error);
      }
    }
  };

  LoginWithFacebook = () => {
    console.log('in login func');
    LoginManager.logInWithPermissions([
      'email',
      'public_profile',
      'user_friends',
    ])
      .then(
        (result) => {
          console.log('fb res', result);
          if (result.isCancelled) {
            alert('Login cancelled');
          } else {
            AccessToken.getCurrentAccessToken()
              .then((data) => {
                let accessToken = data.accessToken;
                console.log('accessToken-------->', accessToken);
                // this.props.Facebook_Login(accessToken)
              })
              .catch((error) => {
                console.log('Some error occured: ' + error);
              });
          }
        },
        function (error) {
          alert('Login fail with error: ' + error);
        },
      )
      .catch((err) => console.log('catch err', err));
  };

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
          email: this.state.email.toLowerCase(),
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
      this.setState({isError: true});
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
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.container}>
          <View>
            <StatusBar />
          </View>
          <Loader visible={isLoding} />
          <ImageBackground
            source={require('../assets/loginbg.png')}
            style={{
              width: '100%',
              height: 200,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            resizeMode="stretch">
            <Image
              style={{height: 150, width: 150, marginTop: -20}}
              source={logo}
            />
          </ImageBackground>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={{alignItems: 'center', marginTop: 30}}>
              <Text style={styles.signupheadingText}>Sign Up</Text>
            </View>

            <View style={styles.body_section}>
              <View style={styles.input}>
                <TextInput
                  style={[
                    styles.input_text,
                    {
                      borderBottomWidth: this.state.isError === true ? 1 : 0.5,
                      borderBottomColor:
                        this.state.isError === true ? 'red' : colors.theme_text,
                      fontFamily: 'SFUIDisplay-Light',
                    },
                  ]}
                  placeholder="User Name"
                  onChangeText={(TextInputValue) =>
                    this.setState({customer_name: TextInputValue})
                  }
                />
              </View>
              <View style={styles.input}>
                <TextInput
                  style={[
                    styles.input_text,
                    {
                      borderBottomWidth: this.state.isError === true ? 1 : 0.5,
                      borderBottomColor:
                        this.state.isError === true ? 'red' : colors.theme_text,
                      fontFamily: 'SFUIDisplay-Light',
                    },
                  ]}
                  placeholder="Phone"
                  keyboardType="phone-pad"
                  onChangeText={(TextInputValue) =>
                    this.setState({phone_number: TextInputValue})
                  }
                />
              </View>
              <View style={styles.input}>
                <TextInput
                  style={[
                    styles.input_text,
                    {
                      borderBottomWidth: this.state.isError === true ? 1 : 0.5,
                      borderBottomColor:
                        this.state.isError === true ? 'red' : colors.theme_text,
                      fontFamily: 'SFUIDisplay-Light',
                    },
                  ]}
                  placeholder="Email Address"
                  keyboardType="email-address"
                  onChangeText={(TextInputValue) =>
                    this.setState({email: TextInputValue})
                  }
                />
              </View>
              <View style={styles.input}>
                <TextInput
                  style={[
                    styles.input_text,
                    {
                      borderBottomWidth: this.state.isError === true ? 1 : 0.5,
                      borderBottomColor:
                        this.state.isError === true ? 'red' : colors.theme_text,
                      fontFamily: 'SFUIDisplay-Light',
                    },
                  ]}
                  placeholder="Password"
                  secureTextEntry={true}
                  onChangeText={(TextInputValue) =>
                    this.setState({password: TextInputValue})
                  }
                />
              </View>
            </View>
            <View style={styles.footer_section}>
              <LinearGradient
                colors={[
                  '#00aeef',
                  '#9fd8ed',
                  // '#86D9F8',
                ]}
                style={{borderRadius: 25, marginHorizontal: 20}}>
                <TouchableOpacity
                  activeOpacity={true ? 0.7 : 0.3}
                  onPress={this.register}
                  style={{padding: 15, alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: 'SFUIDisplay-Light',
                      color: colors.theme_fg_three,
                      fontWeight: 'bold',
                    }}>
                    SIGN UP
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
              <View style={styles.login_content}>
                <Text
                  style={{
                    fontFamily: 'SFUIDisplay-Light',
                    color: colors.theme_text,
                  }}>
                  {' '}
                  Have an account?
                </Text>
                <TouchableOpacity onPress={this.handleBackButtonClick}>
                  <Text style={styles.login_string}> Login Here</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'column',
                marginTop: 20,
                marginVertical: 20,
              }}>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontFamily: 'SFUIDisplay-Medium'}}>
                  Login With
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 15,
                  //  justifyContent:'space-around'
                }}>
                <TouchableOpacity
                  style={{
                    height: 35,
                    width: 35,
                    borderRadius: 35 / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: '#00AEEF',
                  }}
                  activeOpacity={true ? 0.7 : 0.3}
                  onPress={this.LoginWithFacebook}>
                  <Image
                    source={require('../assets/fb.png')}
                    style={{
                      tintColor: '#00AEEF',
                      height: 18,
                      width: 18,
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: 35,
                    width: 35,
                    borderRadius: 35 / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: '#00AEEF',
                    marginHorizontal: 15,
                  }}
                  activeOpacity={true ? 0.7 : 0.3}
                  onPress={() => {
                    this.instagramLogin.show();
                  }}>
                  <Image
                    source={require('../assets/insta.png')}
                    style={{
                      tintColor: '#00AEEF',
                      height: 18,
                      width: 18,
                      resizeMode: 'contain',
                    }}
                  />
                  <InstagramLogin
                    ref={(ref) => (this.instagramLogin = ref)}
                    appId="548937816050116"
                    appSecret="8d94af28016d2d0641c2621e4a932a54"
                    redirectUrl="your-redirect-Url"
                    scopes={['user_profile', 'user_media']}
                    onLoginSuccess={this.setIgToken}
                    onLoginFailure={(data) => console.log(data)}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: 35,
                    width: 35,
                    borderRadius: 35 / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: '#00AEEF',
                  }}
                  activeOpacity={true ? 0.7 : 0.3}
                  onPress={this.LoginWithGoogle}>
                  <Image
                    source={require('../assets/google.png')}
                    style={{
                      tintColor: '#00AEEF',
                      height: 18,
                      width: 18,
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.register.isLoding,
    error: state.register.error,
    data: state.register.data,
    message: state.register.message,
    status: state.register.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
  serviceActionPending: () => dispatch(serviceActionPending()),
  serviceActionError: (error) => dispatch(serviceActionError(error)),
  serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // justifyContent: 'center',
    // backgroundColor: colors.theme_bg_three,
    // marginHorizontal:20
  },
  header_section: {
    width: '100%',
    height: height_40,
    backgroundColor: colors.theme_bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back_content: {
    width: '100%',
    backgroundColor: colors.theme_bg,
    position: 'absolute',
    top: 10,
    left: 10,
  },
  back_icon: {
    color: colors.theme_fg_three,
  },
  logo_content: {
    // marginTop:50,
    height: 150,
    width: 225,
  },
  logo: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: 'contain',
  },
  register_name: {
    color: colors.theme_fg_three,
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  signupheadingText: {
    color: colors.theme_bg,
    marginTop: 5,
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'SFUIDisplay-Light',
  },
  body_section: {
    marginHorizontal: 20,
  },
  input: {
    // height:40,
    width: '100%',
    marginTop: 15,
    marginBottom: 10,
  },
  input_text: {
    borderColor: colors.theme_text,
    borderBottomWidth: 0.5,
    color: colors.theme_text,
    // padding:10,
    // borderRadius:5
  },
  footer_section: {
    // width: '100%',
    marginTop: 25,
    marginHorizontal: 20,
    // alignItems:'center'
  },
  login_content: {
    // width:'80%',
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  login_string: {
    color: colors.theme_fgL,
    fontWeight: 'bold',
    fontFamily: 'SFUIDisplay-Light',
  },
  btn_style: {
    backgroundColor: colors.theme_bg,
  },
});
