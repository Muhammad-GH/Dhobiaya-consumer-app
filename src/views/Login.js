import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  ScrollView,
  BackHandler,
  Image,
  Keyboard,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {Button} from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import {api_url, login, height_40, logo} from '../config/Constants';
import {StatusBar, Loader} from '../components/GeneralComponents';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
} from '../actions/LoginActions';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationActions, StackActions} from 'react-navigation';
import * as colors from '../assets/css/Colors';
import LinearGradient from 'react-native-linear-gradient';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import InstagramLogin from 'react-native-instagram-login';

const {height} = Dimensions.get('window');

class Login extends Component<Props> {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      email: '',
      validation: true,
      isError: false,
    };
  }

  componentDidMount() {
    GoogleSignin.configure();
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
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

  LoginWithFacebook = async () => {
      // Attempt login with permissions
  const result = await LoginManager.logInWithPermissions(['public_profile', 'email','user_friends']);

  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }

  // Once signed in, get the users AccesToken
  const data = await AccessToken.getCurrentAccessToken();

  if (!data) {
    throw 'Something went wrong obtaining access token';
  }

  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

  // Sign-in the user with the credential
  await auth().signInWithCredential(facebookCredential);
  };

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  login = async () => {
    // if (Platform.OS === "android") {
    //   NetInfo.isConnected.fetch().then(isConnected => {
    //     if (isConnected) {
    //       Alert.alert("You are online!");
    //     } else {
    //       Alert.alert("You are offline!");
    //     }
    //   });
    // } else {
    //   // For iOS devices
    //   Alert.alert("You are offline!");
    //   NetInfo.isConnected.addEventListener(
    //     "connectionChange",
    //     this.handleFirstConnectivityChange
    //   );
    // }
    // handleFirstConnectivityChange = isConnected => {
    //   NetInfo.isConnected.removeEventListener(
    //     "connectionChange",
    //     this.handleFirstConnectivityChange
    //   );

    //   if (isConnected === false) {
    //     Alert.alert("You are offline!");
    //   } else {
    //     Alert.alert("You are online!");
    //   }
    // }
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
          email: this.state.email.toLowerCase(),
          password: this.state.password,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          // alert('-------Res--');
          // console.log('res',response)
          // console.log('res',response)
          // await this.props.serviceActionSuccess(response.data);
          // await this.saveData();
          this.props.serviceActionSuccess(response);
          this.saveData();
        })
        .catch((error) => {
          alert(error);
          this.props.serviceActionError(error);
        });
    }
  };

  checkValidate() {
    if (this.state.email == '' || this.state.password == '') {
      this.state.validation = false;
      this.setState({isError: true});
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
      } catch (e) {
        
      }
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
            routeName: 'Splash',
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
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.container}>
          <View>
            <StatusBar/>
          </View>
          <Loader visible={isLoding}/>
          <ImageBackground
            source={require('../assets/loginbg.png')}
            style={{
              width: '100%',
              height: 200,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            resizeMode="stretch">
            <Image style={{height: 150, width: 150, marginTop: -20}} source={logo}/>
          </ImageBackground>
          <View
            style={{flex: 1, justifyContent: 'center'}}>
            <View style={{alignItems: 'center',marginTop:30}}>
              <Text style={styles.loginText}>Login</Text>
            </View>
            <View style={styles.block_two}>
              <View style={styles.email_container}>
                <TextInput
                  style={[
                    styles.email,
                    {
                      borderBottomWidth: this.state.isError === true ? 1 : 0.5,
                      borderBottomColor:
                        this.state.isError === true ? 'red' : colors.theme_text,
                      fontFamily:'SFUIDisplay-Light'
                    },
                  ]}
                  placeholder="Email Address"
                  placeholderTextColor={colors.theme_text}
                  keyboardType="email-address"
                  onChangeText={(TextInputValue) =>
                    this.setState({email: TextInputValue})
                  }
                />
              </View>

              {/* <View style={{ marginTop: 20 }} /> */}
              <View style={styles.password_container}>
                <TextInput
                  style={[
                    styles.password,
                    {
                      borderBottomWidth: 0.5,
                      borderBottomColor:
                        this.state.isError === true ? 'red' : colors.theme_text,
                      fontFamily:'SFUIDisplay-Light'

                    },
                  ]}
                  placeholder="Password"
                  placeholderTextColor={colors.theme_text}
                  secureTextEntry={true}
                  onChangeText={(TextInputValue) =>
                    this.setState({password: TextInputValue})
                  }
                />
              </View>

              <View style={styles.forgot_password_container}>
                <Text
                  onPress={this.forgot}
                  style={{fontFamily: 'SFUIDisplay-Light', color: colors.theme_bg, fontWeight: 'bold'}}>
                  Forgot Password ?
                </Text>
              </View>
            </View>
            <View style={styles.footer}>
              <View style={styles.footer_container}>
                {/* <Button
                title="Login"
                onPress={this.login}
                buttonStyle={{ backgroundColor: colors.theme_bg }}
              /> */}
                <LinearGradient
                  colors={[
                    '#00aeef',
                    '#9fd8ed',
                    // '#86D9F8',
                  ]}
                  style={{borderRadius: 25}}>
                  <TouchableOpacity
                    activeOpacity={true ? 0.7 : 0.3}
                    // pressDelay={1.5}
                    onPress={this.login}
                    style={{padding: 15, alignItems: 'center'}}>
                    <Text style={{fontFamily: 'SFUIDisplay-Medium', color: colors.theme_fg_three}}>LOGIN</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
              <View style={styles.signup_container}>
                <Text style={{fontFamily: 'SFUIDisplay-Medium',}}>Sign up for a new account ?</Text>
                <TouchableOpacity
                  activeOpacity={true ? 0.7 : 0.3}
                  onPress={this.register}>
                  <Text style={{fontFamily: 'SFUIDisplay-Medium', color: colors.theme_fg, marginLeft: 5}}>
                    Sign up
                  </Text>
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
                <Text style={{fontFamily: 'SFUIDisplay-Medium',}}>Login With</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: colors.theme_bg_three
  },
  block_one: {
    width: '100%',
    height: height_40,
    backgroundColor: colors.theme_bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  login_image: {
    height: '100%',
    width: '100%',
  },
  loginText: {
    color: colors.theme_bg,
    marginTop: 5,
    fontSize: 30,
    fontWeight: 'bold',
    // fontFamily:''
    fontFamily: 'SFUIDisplay-Light',
  },
  block_two: {
    // width: '100%',
    // height: height_40,
    // backgroundColor: colors.theme_bg_three,
    // alignItems: 'center',
    // justifyContent: 'center'
    marginHorizontal: 20,
    marginTop: 5,
  },
  email_container: {
    // height: 40,
    width: '100%',
    marginVertical: 30
  },
  email: {
    // borderColor: colors.theme_text,
    // borderBottomWidth: 0.5,
    padding: 10,
    borderRadius: 5,
    fontWeight: '500',
  },
  password_container: {
    // marginHorizontal:10,
    width: '100%',
    marginTop: 5,
    marginVertical: 10
  },
  password: {
    // borderColor: colors.theme_text,
    // borderBottomWidth: 0.5,
    padding: 10,
    borderRadius: 5,
    fontWeight: '500',
  },
  forgot_password_container: {
    // width: '80%',
    marginHorizontal: 20,
    marginTop: 15,
    alignItems: 'flex-end',
    fontWeight: 'bold',
    marginVertical: 10
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    // backgroundColor: "yellow"
  },
  footer_container: {
    width: '80%',
    marginTop: 10,
  },
  signup_container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
});

