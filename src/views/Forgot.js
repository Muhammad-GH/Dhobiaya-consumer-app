import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-elements';
import {Icon} from 'native-base';
import Snackbar from 'react-native-snackbar';
import {
  api_url,
  height_60,
  height_20,
  forgot,
  forgot_pass,
} from '../config/Constants';
import {StatusBar, Loader} from '../components/GeneralComponents';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
} from '../actions/ForgotActions';
import * as colors from '../assets/css/Colors';
import LinearGradient from 'react-native-linear-gradient';

class Forgot extends Component<Props> {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      email: '',
      validation: true,
      isError: false,
    };
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  forgot_password = async () => {
    Keyboard.dismiss();
    await this.checkValidate();
    if (this.state.validation) {
      this.props.serviceActionPending();
      await axios({
        method: 'post',
        url: api_url + forgot,
        data: {email: this.state.email},
      })
        .then(async (response) => {
          // console.log('response------------',response)
          await this.props.serviceActionSuccess(response.data);
          await this.otp();
        })
        .catch((error) => {
          // console.log('error',error)
          alert(error);
          this.props.serviceActionError(error);
        });
    }
  };

  otp() {
    if (this.props.status == 1) {
      this.props.navigation.navigate('Otp');
    } else {
      alert(this.props.message);
    }
  }

  checkValidate() {
    if (this.state.email == '') {
      this.state.validation = false;
      this.setState({isError: true});
      this.showSnackbar('Please enter email address');
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
          <View style={styles.block_one}>
            <View style={styles.back_content}>
              <Icon
                onPress={this.handleBackButtonClick}
                style={styles.back_icon}
                name="left"
                type="AntDesign"
              />
              <Text style={styles.headerText}>Forgot Password</Text>
            </View>
            <View style={styles.forgot_image}>
              <Image
                style={{flex: 1, width: 120, height: 120}}
                source={forgot_pass}
                resizeMode="contain"
              />
            </View>
            <View style={{marginTop: 30}}>
              <Text style={styles.forgot_your_password}>
                Forgot Your Password ?
              </Text>
              <Text style={styles.forgot_your_password1}>
                Worry Not!
              </Text>
            </View>
            <View style={styles.description_content}>
              <Text style={styles.description}>
                Enter your email address associated with your account we will
                send you a link to reset your password
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Text style={{    fontFamily:'SFUIDisplay-Light',
              color: colors.theme_bg, fontWeight: 'bold'}}>
              Enter Email Address
            </Text>
            <TextInput
              style={{
                marginLeft: 1,
                borderBottomWidth: 0.4,
                borderColor: '#dbd7d7',
                width: '80%',
                textAlign: 'center',
                borderBottomWidth: this.state.isError === true ? 1 : 0.5,
                borderBottomColor:
                  this.state.isError === true ? 'red' : colors.theme_text,
                fontFamily:'SFUIDisplay-Light'

              }}
              placeholder="Email Address"
              keyboardType="email-address"
              onChangeText={(TextInputValue) =>
                this.setState({email: TextInputValue})
              }
            />
          </View>
          {/* <View style={styles.block_two} >
            <View style={styles.email_content}>
              <View>
                <Text style={styles.forgot_your_password} >Enter Email Address</Text>
              </View>
              <TextInput
                // style={styles.email}
                placeholder="EMAIL ADDRESS"
                keyboardType="email-address"
                onChangeText={TextInputValue =>
                  this.setState({ email: TextInputValue })}
              />
            </View>
          </View> */}
          <View style={styles.footer}>
            <View style={styles.footer_content}>
              {/*
              <Button
                title="Send OTP"
                onPress={this.forgot_password}
                buttonStyle={styles.send_otp}
              />
            </View> */}
              <LinearGradient
                colors={[
                  '#00aeef',
                  '#9fd8ed',
                  // '#86D9F8',
                ]}
                style={{borderRadius: 25, marginTop: 20}}>
                <TouchableOpacity
                  activeOpacity={true ? 0.7 : 0.3}
                  // pressDelay={1.5}
                  onPress={this.forgot_password}
                  style={{padding: 15, alignItems: 'center'}}>
                  <Text style={{fontFamily:'SFUIDisplay-Bold',color: colors.theme_fg_three}}>Submit</Text>
                </TouchableOpacity>
              </LinearGradient>

              {/* <TouchableOpacity
                  onPress={this.forgot_password}
                style={styles.btnLogin}
              >
                <Text style={{ textAlign: 'center', color: '#fff', padding: 15, fontWeight: 'bold', fontSize: 15 }}>Submit</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.forgot.isLoding,
    error: state.forgot.error,
    data: state.forgot.data,
    message: state.forgot.message,
    status: state.forgot.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
  serviceActionPending: () => dispatch(serviceActionPending()),
  serviceActionError: (error) => dispatch(serviceActionError(error)),
  serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Forgot);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    backgroundColor: colors.theme_bg_three,
  },
  back_icon: {
    color: colors.theme_bg,
    fontSize: 20,
    marginTop: 5,
  },
  headerText: {
    marginLeft: '25%',
    fontFamily:'SFUIDisplay-Medium',
    color: colors.theme_bg,
    fontSize: 20,
  },
  back_content: {
    flexDirection: 'row',
    // justifyContent:'space-around',
    width: '100%',
    position: 'absolute',
    top: 10,
    // left: 5
  },
  block_one: {
    width: '100%',
    height: height_60,
    backgroundColor: colors.theme_bg_three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgot_image: {
    // height:152,
    // width:150
    width: '100%',
    height: '30%',
    alignItems: 'center',
  },
  forgot_your_password: {
    color: colors.theme_fgL,
    // marginTop: 30,
    fontSize: 20,
    fontFamily:'SFUIDisplay-Medium',
  },
  forgot_your_password1: {
    color: colors.theme_fgL,
    marginLeft: '17%',
    fontSize: 16,
    fontFamily:'SFUIDisplay-Medium',
  },
  description_content: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  description: {
    marginTop: 20,
    fontSize: 13,
    textAlign: 'center',    fontFamily:'SFUIDisplay-Light',

    color: colors.theme_fg_four,
  },
  block_two: {
    width: '100%',
    height: height_20,
    backgroundColor: colors.theme_bg_three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  email_content: {
    height: 40,
    width: '80%',
  },
  email: {
    borderColor: colors.theme_fg,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  btnLogin: {
    backgroundColor: colors.theme_bg,
    borderRadius: 25,
    marginTop: 20,
    width: '80%',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  footer_content: {
    width: '90%',
    marginTop: 10,
  },
  send_otp: {
    backgroundColor: colors.theme_bg,
  },
});
