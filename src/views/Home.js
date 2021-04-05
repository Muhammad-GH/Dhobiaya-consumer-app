import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  WebView,
  Image,
  Linking,
  TouchableWithoutFeedback,
} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import {Footer, Container, Content, Body} from 'native-base';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import {StatusBar, Loader} from '../components/GeneralComponents';
import {img_url, api_url, logo12} from '../config/Constants';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Icon} from 'native-base';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import ResponsiveText from "../components/ResponsiveText";

class Home extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      check: false,
      isActiveOne: true,
      isActiveTwo: false,
      isActiveThree: false,
      isActiveFour: false,

      value: 0,
      radio_props: [
        {label: 'Calculate Now', value: 0 },
        {label: 'Order Now', value: 1 }
      ],
    };
  }

  componentDidMount() {
    this.timer();
  }

  timer = () => {
    setInterval(() => {
      if (this.state.isActiveOne) {
        this.setState({
          isActiveTwo: true,
          isActiveOne: false,
          isActiveThree: false,
          isActiveFour: false,
        });
      } else if (this.state.isActiveTwo) {
        this.setState({
          isActiveThree: true,
          isActiveOne: false,
          isActiveTwo: false,
          isActiveFour: false,
        });
      } else if (this.state.isActiveThree) {
        this.setState({
          isActiveFour: true,
          isActiveThree: false,
          isActiveOne: false,
          isActiveTwo: false,
        });
      } else if (this.state.isActiveFour) {
        this.setState({
          isActiveFour: false,
          isActiveThree: false,
          isActiveOne: true,
          isActiveTwo: false,
        });
      }
    }, 6500);
    // 6500
  };

  stepOne = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '55%'
          }}>
          <Image
            style={{width: '50%', height: '40%',}}
            resizeMode="contain"
            source={require('../assets/step1.png')}
          />
          <Text style={{fontSize: 18,     fontFamily:'SFUIDisplay-Medium',
            fontWeight: 'bold', color: colors.theme_bg}}>
            Select Services
          </Text>
          
          <RadioForm
            >
          {
            this.state.radio_props.map((obj, i) => (
              <RadioButton labelHorizontal={true} key={i} >
                {/*  You can set RadioButtonLabel before RadioButtonInput */}
                <RadioButtonInput
                  obj={obj}
                  index={i}
                  isSelected={this.state.value === i}
                  onPress={(e) => this.setState({value: i})}
                  borderWidth={1}
                  buttonColor={'#00AEEF'}
                  buttonOuterColor={'#00AEEF'}
                  buttonSize={15}
                  buttonOuterSize={22}
                  buttonWrapStyle={{marginLeft: 20, marginTop: 29}}
                />
                <RadioButtonLabel
                  obj={obj}
                  index={i}
                  labelHorizontal={true}
                  onPress={(e) => this.setState({value: i})}
                  labelStyle={{fontSize: 18, color: '#00AEEF',marginTop: 29}}
                  labelWrapStyle={{}}
                />
              </RadioButton>
            ))
          }  
        </RadioForm>

        </View>
        <View style={{width: '45%',}}>
          <Image
            style={{width: '100%', height: '100%'}}
            resizeMode="contain"

            source={require('../assets/stepmob1.png')}
          />
        </View>
      </View>
    );
  };

  stepTwo = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '55%'
          }}>
          <Image
            style={{width: '50%', height: '40%',}}
            resizeMode="contain"
            source={require('../assets/step2.png')}
          />
          <Text style={{fontSize: 18,    fontFamily:'SFUIDisplay-Medium',
            fontWeight: 'bold', color: colors.theme_bg}}>
            Add Your Laundry
          </Text>

           <RadioForm
            >
          {
            this.state.radio_props.map((obj, i) => (
              <RadioButton labelHorizontal={true} key={i} >
                {/*  You can set RadioButtonLabel before RadioButtonInput */}
                <RadioButtonInput
                  obj={obj}
                  index={i}
                  isSelected={this.state.value === i}
                  onPress={(e) => this.setState({value: i})}
                  borderWidth={1}
                  buttonColor={'#00AEEF'}
                  buttonOuterColor={'#00AEEF'}
                  buttonSize={15}
                  buttonOuterSize={22}
                  buttonWrapStyle={{marginLeft: 8, marginTop: 29}}
                />
                <RadioButtonLabel
                  obj={obj}
                  index={i}
                  labelHorizontal={true}
                  onPress={(e) => this.setState({value: i})}
                  labelStyle={{fontSize: 18, color: '#00AEEF',marginTop: 29}}
                  labelWrapStyle={{}}
                />
              </RadioButton>
            ))
          }  
        </RadioForm>

        </View>
        <View style={{width: '45%',}}>
          <Image
            style={{width: '100%', height: '100%'}}
            resizeMode="contain"
            source={require('../assets/stepmob2.png')}
          />
        </View>
      </View>
    );
  };

  stepThree = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '55%'
          }}>
          <Image
            style={{width: '50%', height: '40%',}}
            resizeMode="contain"
            source={require('../assets/step3.png')}
          />
          <Text style={{fontSize: 18,    fontFamily:'SFUIDisplay-Medium',
            fontWeight: 'bold', color: colors.theme_bg}}>
            Select Pickup Location
          </Text>

           <RadioForm
            >
          {
            this.state.radio_props.map((obj, i) => (
              <RadioButton labelHorizontal={true} key={i} >
                {/*  You can set RadioButtonLabel before RadioButtonInput */}
                <RadioButtonInput
                  obj={obj}
                  index={i}
                  isSelected={this.state.value === i}
                  onPress={(e) => this.setState({value: i})}
                  borderWidth={1}
                  buttonColor={'#00AEEF'}
                  buttonOuterColor={'#00AEEF'}
                  buttonSize={15}
                  buttonOuterSize={22}
                  buttonWrapStyle={{ marginTop: 29}}
                />
                <RadioButtonLabel
                  obj={obj}
                  index={i}
                  labelHorizontal={true}
                  onPress={(e) => this.setState({value: i})}
                  labelStyle={{fontSize: 18, color: '#00AEEF',marginTop: 29}}
                  labelWrapStyle={{}}
                />
              </RadioButton>
            ))
          }  
        </RadioForm>

        </View>
        <View style={{width: '45%'}}>
          <Image
            style={{width: '100%', height: '100%'}}
            resizeMode="contain"
            source={require('../assets/stepmob3.png')}
          />
        </View>
      </View>
    );
  };
  stepFour = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '55%'
          }}>
          <Image
            style={{width: '30%', height: '20%'}}
            resizeMode="contain"
            source={require('../assets/step5.png')}
          />
          <Text style={{fontSize: 18, marginTop: '15%', fontFamily:'SFUIDisplay-Medium',
            fontWeight: 'bold', color: colors.theme_bg}}>
            Order Complete
          </Text>

           <RadioForm
            >
          {
            this.state.radio_props.map((obj, i) => (
              <RadioButton labelHorizontal={true} key={i} >
                {/*  You can set RadioButtonLabel before RadioButtonInput */}
                <RadioButtonInput
                  obj={obj}
                  index={i}
                  isSelected={this.state.value === i}
                  onPress={(e) => this.setState({value: i})}
                  borderWidth={1}
                  buttonColor={'#00AEEF'}
                  buttonOuterColor={'#00AEEF'}
                  buttonSize={15}
                  buttonOuterSize={22}
                  buttonWrapStyle={{marginLeft: 25, marginTop: 29}}
                />
                <RadioButtonLabel
                  obj={obj}
                  index={i}
                  labelHorizontal={true}
                  onPress={(e) => this.setState({value: i})}
                  labelStyle={{fontSize: 18, color: '#00AEEF',marginTop: 29}}
                  labelWrapStyle={{}}
                />
              </RadioButton>
            ))
          }  
        </RadioForm>

        </View>
        <View style={{width: '45%'}}>
          <Image
            style={{width: '100%', height: '100%'}}
            resizeMode="contain"
            source={require('../assets/stepmob4.png')}
          />
        </View>
      </View>
    );
  };

  render() {
    const {isLoding, error, data, message, status} = this.props;
    return (
      <View style={styles.container}>
        <StatusBar/>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.discountView}>
            <View style={{flex: 1}}>
              <ResponsiveText style={styles.percentageText}>Flat 30% off on First order</ResponsiveText>
              <ResponsiveText style={styles.discountSubText}>You can also Order Directly by tapping through the
                following</ResponsiveText>
            </View>
            <View style={{flex: 1.5, justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={require("../assets/laundry.png")}
                style={styles.discountImage}
              />
            </View>
          </View>
          <View
            style={{
              marginHorizontal: 0,
              marginTop: 15,
              alignItems: 'center',
            }}>
            <Text style={{    fontFamily:'SFUIDisplay-Medium',
              fontWeight: 'bold', fontSize: 18}}>
              How The App Works
            </Text>
            <View style={{flexDirection: 'row', marginTop: 29}}>
              <TouchableOpacity
                style={{
                  borderRadius: 5,
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  backgroundColor: this.state.isActiveOne ? '#00AEEF' : '#9fd8ed',
                }}
                onPress={() =>
                  this.setState({
                    isActiveOne: true,
                    isActiveTwo: false,
                    isActiveThree: false,
                    isActiveFour: false,
                  })
                }>
                <Text style={{    fontFamily:'SFUIDisplay-Medium',
                  color: colors.theme_bg_three, fontSize: 15}}>
                  01
                </Text>
              </TouchableOpacity>
              <View style={styles.steplink}/>
              <TouchableOpacity
                style={{
                  borderRadius: 5,
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  backgroundColor: this.state.isActiveTwo ? '#00AEEF' : '#9fd8ed',
                }}
                onPress={() =>
                  this.setState({
                    isActiveOne: false,
                    isActiveTwo: true,
                    isActiveThree: false,
                    isActiveFour: false,
                  })
                }>
                <Text style={{    fontFamily:'SFUIDisplay-Medium',
                  color: colors.theme_bg_three, fontSize: 15}}>
                  02
                </Text>
              </TouchableOpacity>
              <View style={styles.steplink}/>
              <TouchableOpacity
                style={{
                  borderRadius: 5,
                  paddingVertical: 8, paddingHorizontal: 10,
                  backgroundColor: this.state.isActiveThree ? '#00AEEF' : '#9fd8ed',
                }}
                onPress={() =>
                  this.setState({
                    isActiveOne: false,
                    isActiveTwo: false,
                    isActiveThree: true,
                    isActiveFour: false,
                  })
                }>
                <Text style={{    fontFamily:'SFUIDisplay-Medium',
                  color: colors.theme_bg_three, fontSize: 15}}>
                  03
                </Text>
              </TouchableOpacity>
              <View style={styles.steplink}/>
              <TouchableOpacity
                style={{
                  borderRadius: 5,
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  backgroundColor: this.state.isActiveFour ? '#00AEEF' : '#9fd8ed',
                }}
                onPress={() =>
                  this.setState({
                    isActiveOne: false,
                    isActiveTwo: false,
                    isActiveThree: false,
                    isActiveFour: true,
                  })
                }>
                <Text style={{    fontFamily:'SFUIDisplay-Medium',
                  color: colors.theme_bg_three, fontSize: 15}}>
                  04
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{
            flex: 2.5,
            marginTop: 29
          }}>
            {this.state.isActiveOne
              ? this.stepOne()
              : this.state.isActiveTwo
                ? this.stepTwo()
                : this.state.isActiveThree
                  ? this.stepThree()
                  : this.state.isActiveFour
                    ? this.stepFour()
                    : null}
          </View>
          <View style={{
            flex: 1.5,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: -30
          }}>

            {message !== 'Success' ? null : 
             this.state.value === 0 ? (
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 0, y: 0}}
              colors={['#00aeef', '#9fd8ed']}
              style={{borderRadius: 25, margin: 20}}>
              <TouchableOpacity
                activeOpacity={true ? 0.7 : 0.3}
                onPress={() => {
                  AsyncStorage.setItem('seen', JSON.stringify(true))
                    .then(this.props.navigation.navigate('Dashboard'))
                    .catch((err) => console.log('async setting error on home'));
                }}
                style={{paddingTop: 15,paddingBottom: 15,paddingLeft: 40,paddingRight: 40, alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: 'SFUIDisplay-Light',
                    color: colors.theme_fg_three,
                    fontWeight: 'bold',
                  }}>
                  Start Order{''}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 0, y: 0}}
              colors={['#00aeef', '#9fd8ed']}
              style={{borderRadius: 25, margin: 20}}>
              <TouchableOpacity
                activeOpacity={true ? 0.7 : 0.3}
                onPress={() => {
                  AsyncStorage.setItem('seen', JSON.stringify(true))
                    .then(this.props.navigation.navigate('Cart', {myCart: {}}))
                    .catch((err) => console.log('async setting error on home'));
                }}
                style={{paddingTop: 15,paddingBottom: 15,paddingLeft: 30,paddingRight: 30, alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: 'SFUIDisplay-Light',
                    color: colors.theme_fg_three,
                    fontWeight: 'bold',
                  }}>
                  Schedule Pickup{''}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          )
            }
          
          </View>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.home.isLoding,
    error: state.home.error,
    message: state.home.message,
    status: state.home.status,
    total_items: state.product.total_items,
  };
}

const mapDispatchToProps = (dispatch) => ({
  productListReset: () => dispatch(productListReset()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  discountView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: '10%'
  },
  percentageText: {
    color: '#00AEEF',
    fontWeight: 'bold',
    fontSize: 5,
  },
  discountSubText: {
    color: '#5E5E5E',
    fontSize: 3,
  },
  discountImage: {
    height: wp("30%"),
    width: wp("45%"),
    resizeMode: 'contain'
  },
  background_image: {
    width: '100%',
    height: 170,
  },
  steplink: {
    alignSelf: 'baseline',
    backgroundColor: '#74cded',
    width: 44,
    marginLeft: -1,
    marginRight: -1,
    top: 15,
    height: 3,
    borderRadius: 10,
  },
  touchable_opacity: {
    backgroundColor: colors.black_layer,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  service_name: {
    color: colors.theme_bg_three,
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    color: colors.theme_bg_three,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
  },
  socialText: {
    marginHorizontal: 40,
    justifyContent: 'center',
    marginTop: 10,
  },
  socialView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
    marginTop:10
  },
  socialicon: {
    width: 50,
    height: 50,
  },
  orderButtonTouchable: {
    padding: 15,
    borderRadius: 25,
    width: "70%",
    top: 15,
    backgroundColor: '#00AEEF',
    alignItems: 'center'
  }

});
