import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Keyboard,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Left,
  Body,
  Right,
  Row,
  Title,
  Icon,
  Footer,
} from 'native-base';
import {Button} from 'react-native-elements';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import {
  height_50,
  GOOGLE_KEY,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
  api_url,
  address,
  pin,
  edite_icon,
} from '../config/Constants';
import Snackbar from 'react-native-snackbar';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
  editServiceActionPending,
  editServiceActionError,
  editServiceActionSuccess,
  updateServiceActionPending,
  updateServiceActionError,
  updateServiceActionSuccess,
} from '../actions/AddressActions';
import axios from 'axios';
import {connect} from 'react-redux';
import {Loader} from '../components/GeneralComponents';
import * as colors from '../assets/css/Colors';
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

class Address extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      address: 'Please select your location...',
      latitude: 0,
      longitude: 0,
      coordinates: [],
      radius: Platform.OS === 'android' ? 500 : 500,
      address_id: this.props.navigation.getParam('id'),
      isEdite: true,

      door_no:'',
      mapRegion: null,
      validation:true,
      open_map:0
    };
  }

  add_address = async () => {
    Keyboard.dismiss();
    await this.checkValidate();
    if (this.state.validation) {
      this.props.serviceActionPending();
      await axios({
        method: 'post',
        url: api_url + address,
        data: {
          customer_id: global.id,
          address: this.state.address.toString(),
          door_no: this.state.door_no,
          latitude: this.state.latitude,
          longitude: this.state.longitude,
        },
      })
        .then(async (response) => {
          await this.props.serviceActionSuccess(response.data);
          await this.redirect(response.data);
          await this.props.navigation.goBack(null);
        })
        .catch((error) => {
          this.showSnackbar('Sorry something went wrong!');
          this.props.serviceActionError(error);
        });
    }
  };

  redirect = async (data) => {
    if (data.status == 1) {
      //  this.handleBackButtonClick();
    } else {
      alert(data.message);
    }
  };

  checkValidate() {
    if (this.state.door_no == '') {
      this.state.validation = false;
      this.showSnackbar('Please enter door number');
      return true;
    } else if (this.state.address == 'Please select your location...') {
      this.state.validation = false;
      this.showSnackbar('Please select your location in map');
      return true;
    } else if (this.state.address == '') {
      this.state.validation = false;
      this.showSnackbar('Please Enter Address');
      return true;
    } else {
      this.state.validation = true;
    }
  }

  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  handleBackButtonClick = () => {
    this.props.navigation.goBack(null);
  };

  async componentDidMount() {
    if (Platform.OS === 'ios') {
      await this.findType();
    } else {
      await this.requestCameraPermission();
    }
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'DhobiAya needs to Access your location for tracking',
          // buttonNegative:'#222'
          ok: 'YES',
        },
        // style={}
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await this.findType();
      } else {
        // await this.handleBackButtonClick();
      }
    } catch (err) {
      // await this.handleBackButtonClick();
    }
  }

  async findType() {
    // console.log('address_id',this.state.address_id)
    if (this.state.address_id == 0) {
      // if(true){
      await this.getInitialLocation();
    } else {
      // console.log('address_id->',this.state.address_id)
      await this.edit_address();
    }
  }

  edit_address = async () => {
    this.props.editServiceActionPending();
    await axios({
      method: 'get',
      url: api_url + address + '/' + this.state.address_id + '/edit',
    })
      .then(async (response) => {
        await this.props.editServiceActionSuccess(response.data);
        await this.setState({open_map: 1});
        await this.setLocation();
      })
      .catch((error) => {
        this.showSnackbar('Sorry something went wrong!');
        this.props.editServiceActionError(error);
      });
  };

  async setLocation() {
    let region = {
      latitude: parseFloat(this.props.data.latitude),
      longitude: parseFloat(this.props.data.longitude),
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
    this.setState({ address : this.props.data.address, door_no : this.props.data.door_no, mapRegion: region })
    // this.setState({
    //   address: this.props.data.address,
    //   door_no: this.props.data.door_no,
    //   latitude: parseFloat(this.props.data.latitude),
    //   longitude: parseFloat(this.props.data.longitude),
    //   latitudeDelta: LATITUDE_DELTA,
    //   longitudeDelta: LONGITUDE_DELTA,
    // });
  }

  update_address = async () => {
    Keyboard.dismiss();
    await this.checkValidate();
    if (this.state.validation) {
      this.props.updateServiceActionPending();
      await axios({
        method: 'patch',
        url: api_url + address + '/' + this.state.address_id,
        data: {
          customer_id: global.id,
          address: this.state.address.toString(),
          door_no: this.state.door_no,
          latitude: this.state.latitude,
          longitude: this.state.longitude,
        },
      })
        .then(async (response) => {
          await this.props.updateServiceActionSuccess(response.data);
          await this.redirect(response.data);
          await this.props.navigation.goBack(null);
        })
        .catch((error) => {
          this.showSnackbar('Sorry something went wrong!');
          this.props.updateServiceActionError(error);
        });
    }
  };

  async getInitialLocation(){
    await Geolocation.getCurrentPosition( async(position) => {
      this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      let region = {
        latitude:       await position.coords.latitude,
        longitude:      await position.coords.longitude,
        latitudeDelta:  LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
      this.setState({ mapRegion: region, open_map:1 });
    }, error => console.log(error) , 
    {enableHighAccuracy: false, timeout: 10000 });
  }

  // async getInitialLocation() {
  //   console.warn('Hello world');
  //   Geolocation.requestAuthorization("whenInUse");
  //   Geolocation.getCurrentPosition(
  //     (position) => {
  //       console.warn('region============================>', position);
  //       this.setState({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //         coordinates: this.state.coordinates.concat({
  //           latitude: position.coords.latitude,
  //           longitude: position.coords.longitude,
  //           open_map: 1,
  //         }),
  //       });
  //     },
  //     (error) => {
  //       console.warn(
  //         '================================',
  //         error.message.toString(),
  //       );
  //     },
  //     {
  //       // showLocationDialog: true,
  //       // enableHighAccuracy: true,
  //       // timeout: 10000,
  //       // maximumAge: 0,
  //     },
  //   );
  // }

  onRegionChange = async (value) => {
    this.setState({ address : 'Please wait' });

    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + value.latitude + ',' + value.longitude + '&key=' + GOOGLE_KEY)
      .then((response) => response.json())
      .then(async(responseJson) => {
        if(responseJson.results[0].formatted_address != undefined){
          this.setState({ address : responseJson.results[0].formatted_address, latitude: value.latitude, longitude: value.longitude });
        }else{
          this.setState({ address : 'sorry something went wrong' });
        }
      })
  };

  editeShow = () => {
    this.setState({
      isEdite: !this.state.isEdite,
      address: this.state.address,
    });
  };

  render() {
    const {isLoding} = this.props;
    return (
      <Container
        keyboardShouldPersistTaps="always"
        style={{backgroundColor: colors.theme_bg_three}}>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header}>
          <Left style={{flex: 1}}>
            <TouchableOpacity
              onPress={this.handleBackButtonClick}
              style={{width: '50%'}}>
              <Image
                source={require('../assets/arrowleft.png')}
                style={{
                  tintColor: colors.theme_fg_two,
                  height: wp('3%'),
                  width: wp('3%'),
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </Left>
          <Body style={styles.header_body}>
            <Title style={styles.title}>CREATE ADDRESS</Title>
          </Body>
          <Right />
        </Header>

        {this.state.open_map == 1 && (
          <Content keyboardShouldPersistTaps="always">
            <View style={styles.content} >
           <MapView
               provider={PROVIDER_GOOGLE} 
               style={styles.map}
               initialRegion={ this.state.mapRegion }
               onRegionChangeComplete={(region) => {
                  this.onRegionChange(region); 
               }}
            >
            </MapView>
            <View style={styles.location_markers}>
              <View style={styles.pin} >
                <Image
                  style= {{flex:1 , width: undefined, height: undefined}}
                  source={pin}
                />
              </View>
            </View>
          </View>
            <View style={styles.address_content}>
              <View style={{flexDirection: 'row'}}>
                <Left>
                  {/* <Text style={styles.landmark_label} >Door no / Landmark</Text> */}
                  <Text style={styles.landmark_label}>House No / Flat No </Text>
                </Left>
              </View>
              <View style={styles.landmark_content}>
                <TextInput
                  style={styles.landmark_text}
                  onChangeText={(TextInputValue) =>
                    this.setState({door_no: TextInputValue})
                  }
                  value={this.state.door_no}
                />
              </View>
              <View style={{marginTop: 20}} />

              <Row style={{flexDirection: 'row'}}>
                <Left>
                  <Text style={styles.address_label}>Address</Text>
                </Left>
                <Right style={{flexWrap: 'wrap-reverse'}}>
                  <TouchableOpacity onPress={this.editeShow}>
                    <View></View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.editeShow}>
                    <Image
                      source={edite_icon}
                      style={{width: 25, height: 25}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </Right>
              </Row>

              <View style={{flexDirection: 'row'}}>
                <Left>
                  {/* <Text style={styles.address_text} >
                  {this.state.address}
                </Text> */}
                  {
                    this.state.isEdite ? (
                      <TextInput
                        onChangeText={(TextInputValue) =>
                          this.setState({address: TextInputValue})
                        }
                        style={{
                          borderBottomColor: colors.theme_bg,
                          borderBottomWidth: 0.5,
                          width: '100%',
                        }}
                        value={this.state.address}
                        multiline={true}
                      />
                    ) : (
                      <Text style={styles.address_text}>
                        {this.state.address}
                      </Text>
                    )
                    // <TextInput
                    // onChangeText={ TextInputValue =>
                    // this.setState({address : TextInputValue }) }
                    // placeholderTextColor="#000"
                    // editable={false}
                    // value={this.state.address}
                    // multiline={true}
                    // />
                  }
                </Left>
              </View>
            </View>
          </Content>
        )}
        {this.state.open_map == 1 && (
          <Footer style={styles.footer}>
            <View style={styles.footer_content}>
              <LinearGradient
                colors={['#00aeef', '#9fd8ed']}
                style={{borderRadius: 25}}>
                <TouchableOpacity
                  activeOpacity={true ? 0.7 : 0.3}
                  onPress={
                    this.state.address_id !== 0
                      ? this.update_address
                      : this.add_address
                  }
                  style={{padding: 12, alignItems: 'center'}}>
                  <Text style={{color: colors.theme_fg_three}}>DONE</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </Footer>
        )}
        <Loader visible={isLoding} />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.address.isLoding,
    message: state.address.isLoding,
    status: state.address.isLoding,
    data: state.address.data,
  };
}

const mapDispatchToProps = (dispatch) => ({
  serviceActionPending: () => dispatch(serviceActionPending()),
  serviceActionError: (error) => dispatch(serviceActionError(error)),
  serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data)),
  editServiceActionPending: () => dispatch(editServiceActionPending()),
  editServiceActionError: (error) => dispatch(editServiceActionError(error)),
  editServiceActionSuccess: (data) => dispatch(editServiceActionSuccess(data)),
  updateServiceActionPending: () => dispatch(updateServiceActionPending()),
  updateServiceActionError: (error) =>
    dispatch(updateServiceActionError(error)),
  updateServiceActionSuccess: (data) =>
    dispatch(updateServiceActionSuccess(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Address);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.theme_bg_three,
  },
  icon: {
    color: colors.theme_fg_two,
  },
  header_body: {
    flex: 3,
    justifyContent: 'center',
  },
  title: {
    alignSelf: 'center',
    color: colors.theme_fg_two,
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: height_50,
  },
  location_markers: {
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {
    height: 30,
    width: 25,
    top: -15,
  },
  address_content: {
    width: '100%',
    padding: 20,
    backgroundColor: colors.theme_bg_three,
    marginBottom: 10,
  },
  landmark_label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.theme_fg_two,
  },
  landmark_content: {
    width: '100%',
    marginTop: 5,
  },
  landmark_text: {
    borderColor: colors.theme_fg,
    borderBottomWidth: 1,
    padding: 10,
    borderRadius: 5,
    height: 40,
  },
  address_label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.theme_fg_two,
  },
  address_text: {
    fontSize: 13,
    paddingVertical: 5,
    marginTop: 5,
  },
  footer: {
    backgroundColor: colors.theme_bg_three,
    height: 70,
  },
  footer_content: {
    height: 70,
    width: '72%',
    justifyContent: 'center',
  },
  done: {
    backgroundColor: colors.theme_bg,
  },
});