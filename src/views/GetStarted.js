import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import {
  Container,
  Spinner,
  Content,
  Form,
  Item,
  Input,
  Button,
} from 'native-base';
import {NavigationActions, StackActions} from 'react-navigation';
import {api_url, logo, settings} from '../config/Constants';
import * as colors from '../assets/css/Colors';
import {StatusBar, Loader} from '../components/GeneralComponents';
import LinearGradient from 'react-native-linear-gradient';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import InstagramLogin from 'react-native-instagram-login';
const {height} = Dimensions.get('window');
class GetStart extends Component {
  getoLogin = () => {
    // this.props.navigation.navigate('LoginSignUp',{activetab:0,initialPage:0})
    this.props.navigation.navigate('Login');
  };

  getoSignUp = () => {
    // this.props.navigation.navigate('LoginSignUp',{activetab:1,initialPage:0})
    this.props.navigation.navigate('Register');
  };

  componentDidMount() {
    GoogleSignin.configure({});
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
      alert(`Name: ${user.name}\nEmail: ${user.email}`); // console.log('accessToken-------------->', userInfo.accessToken)
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
        console.log('userInfo---------ELSE----->');
      }
    }
  };

  LoginWithFacebook = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      (result) => {
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
    );
  };

  render() {
    return (
      <Container>
        <Content style={{flex: 1}}>
          <View style={styles.container}>
            <ImageBackground
              source={require('../assets/loginbg.png')}
              style={{
                width: '100%',
                height: 255,
                alignItems: 'center',
                justifyContent:'center',
              }}
              resizeMode="stretch">
              <Image style={{height: 150, width: 150,marginTop:-20}} source={logo} />
            </ImageBackground>
            <View
              style={{
                flex: 1,
                height: height - 200,
                justifyContent: 'center',
              }}>
              <View style={styles.buttons}>
                <LinearGradient
                  colors={['#00aeef', '#9fd8ed']}
                  style={{borderRadius: 25}}>
                  <TouchableOpacity
                    activeOpacity={true ? 0.7 : 0.3}
                    onPress={this.getoLogin}
                    style={{padding: 15, alignItems: 'center'}}>
                    <Text style={{fontFamily:'SFUIDisplay-Medium',color: colors.theme_fg_three}}>LOGIN</Text>
                  </TouchableOpacity>
                </LinearGradient>
                {/* </LinearGradient> */}
                <View
                  style={{
                    marginTop: 0,
                    alignItems: 'center',
                      padding: 15
                  }}>
                  <Text style={{fontFamily:'SFUIDisplay-Bold',color: colors.theme_text}}>OR</Text>
                </View>
                <LinearGradient
                  colors={['#00aeef', '#9fd8ed']}
                  style={{borderRadius: 25}}>
                  <TouchableOpacity
                    activeOpacity={true ? 0.7 : 0.3}
                    onPress={this.getoSignUp}
                    style={{padding: 15, alignItems: 'center'}}>
                    <Text style={{fontFamily:'SFUIDisplay-Medium',color: colors.theme_fg_three}}>SIGN UP</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  marginTop: 20,
                  marginVertical: 20,
                }}>
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
        </Content>
      </Container>
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
});

export default GetStart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width:'100%',
    // flexDirection:'column'
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor:colors.theme_bg
  },
  image_view: {
    // height:225,
    // width:225,
    // alignItems:'center',
    marginTop: 20,
  },
  heading: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'column',
    marginHorizontal: 30,
    // marginTop: 60
  },
});
