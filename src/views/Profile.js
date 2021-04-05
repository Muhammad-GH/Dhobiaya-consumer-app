import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Container,
  Content,
  Header,
  Left,
  Body,
  Right,
  Title,
  Icon,
  Row,
  Footer,
  Tab,
  Tabs,
  Col,
  List,
  ListItem,
} from 'native-base';
import {Button} from 'react-native-elements';
import {
  api_url,
  profile,
  height_35,
  height_40,
  options,
  profile_picture,
  default_img,
} from '../config/Constants';
import {StatusBar, Loader} from '../components/GeneralComponents';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  editServiceActionPending,
  editServiceActionError,
  editServiceActionSuccess,
  updateServiceActionPending,
  updateServiceActionError,
  updateServiceActionSuccess,
  updateProfilePicture,
} from '../actions/ProfileActions';
import ImagePicker from 'react-native-image-picker';
// import RNFetchBlob from 'react-native-fetch-blob';
import RNFetchBlob from 'rn-fetch-blob';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

class Profile extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      profile_picture: '',
      customer_name: '',
      phone_number: '',
      email: '',
      password: '',
      validation: true,
      data: '',
    };
  }

  handleBackButtonClick = () => {
    this.props.navigation.goBack(null);
  };

  async componentDidMount() {
    await this.get_profile();
  }

  get_profile = async () => {
    this.props.editServiceActionPending();
    await axios({
      method: 'get',
      url: api_url + profile + '/' + global.id + '/edit',
    })
      .then(async (response) => {
        await this.props.editServiceActionSuccess(response.data);
        await this.setState({
          customer_name: this.props.data.customer_name,
          email: this.props.data.email,
          phone_number: this.props.data.phone_number,
          profile_picture: this.props.profile_picture,
        });
      })
      .catch((error) => {
        this.showSnackbar('Sorry something went wrong!');
        this.props.editServiceActionError(error);
      });
  };

  update_profile = async () => {
    Keyboard.dismiss();
    await this.checkValidate();
    if (this.state.validation) {
      this.props.updateServiceActionPending();
      await axios({
        method: 'patch',
        url: api_url + profile + '/' + global.id,
        data: {
          customer_name: this.state.customer_name,
          phone_number: this.state.phone_number,
          email: this.state.email,
          password: this.state.password,
        },
      })
        .then(async (response) => {
          await this.props.updateServiceActionSuccess(response.data);
          await this.saveData();
        })
        .catch((error) => {
          this.props.updateServiceActionError(error);
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
        await this.setState({password: ''})
        this.showSnackbar('Profile updated Successfully');
      } catch (e) {}
    } else {
      alert(this.props.message);
    }
  };

  checkValidate() {
    if (
      this.state.email == '' ||
      this.state.phone_number == '' ||
      this.state.customer_name == '' ||
      this.state.password == ''
    ) {
      this.state.validation = false;
      this.showSnackbar('Please fill all the fields.');
      return true;
    }
  }

  select_photo() {
    ImagePicker.showImagePicker((response) => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else {
        // console.log('ImagePicker  response.uri: ', response.uri);
        const source = {uri: response.uri};
        this.setState({
          data: response.data,
        });
        this.props.updateProfilePicture(source);
        this.profileimageupdate();
      }
    });
  }

  profileimageupdate = async () => {
    RNFetchBlob.fetch(
      'POST',
      api_url + profile_picture,
      {
        'Content-Type': 'multipart/form-data',
      },
      [
        {
          name: 'profile_picture',
          filename: 'image.png',
          type: 'image/png',
          data: this.state.data,
        },
        {
          name: 'customer_id',
          data: global.id,
        },
      ],
    )
      .then((resp) => {
        this.showSnackbar('Updated Successfully');
      })
      .catch((err) => {
        this.showSnackbar('Error on while uploading,Try again');
      });
  };

  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  render() {
    const {
      isLoding,
      error,
      data,
      profile_picture,
      message,
      status,
    } = this.props;

    return (
      <Container>
        <View>
          <StatusBar />
        </View>
        {/* Header section */}
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header}>
          <Left style={{flex: 1}}>
            <TouchableOpacity
              onPress={this.handleBackButtonClick}
              style={{width: '50%'}}>
              <Image
                source={require('../assets/arrowleft.png')}
                style={{
                  tintColor: colors.theme_bg_two,
                  height: wp('3%'),
                  width: wp('3%'),
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </Left>
          <Body style={styles.header_body}>
            <Title style={styles.title}>Profile</Title>
          </Body>
          <Right />
        </Header>

        {/* <ScrollView
          keyboardShouldPersistTaps='always'
          style={styles.page_background}
        > */}
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header_section}>
              <TouchableOpacity onPress={this.select_photo.bind(this)}>
                <Image
                  style={styles.profile_image}
                  resizeMode="cover"
                  source={profile_picture ? profile_picture : default_img}
                />
              </TouchableOpacity>
              <View>
                <Text style={styles.profile_name}>
                  {this.state.customer_name}
                </Text>
              </View>
            </View>

            {/* Body section */}
            <View style={styles.body_section}>
              <View style={styles.input}>
                <TextInput
                  style={styles.text_input}
                  placeholder="Username"
                  value={this.state.customer_name}
                  onChangeText={(TextInputValue) =>
                    this.setState({customer_name: TextInputValue})
                  }
                />
              </View>
              <View style={styles.input}>
                <TextInput
                  style={styles.text_input}
                  placeholder="Phone"
                  keyboardType="phone-pad"
                  value={this.state.phone_number}
                  onChangeText={(TextInputValue) =>
                    this.setState({phone_number: TextInputValue})
                  }
                />
              </View>
              <View style={styles.input}>
                <TextInput
                  style={styles.text_input}
                  placeholder="Email Address"
                  keyboardType="email-address"
                  value={this.state.email}
                  onChangeText={(TextInputValue) =>
                    this.setState({email: TextInputValue})
                  }
                />
              </View>
              <View style={styles.input}>
                <TextInput
                  style={styles.text_input}
                  placeholder="Password"
                  secureTextEntry={true}
                  value={this.state.password}
                  onChangeText={(TextInputValue) =>
                    this.setState({password: TextInputValue})
                  }
                />
              </View>
            </View>

            {/* Footer section */}
            <View style={styles.footer_section}>
              {this.state.password == '' ? null : (
                <LinearGradient
                  colors={['#00aeef', '#9fd8ed']}
                  style={{borderRadius: 25, marginVertical: 10, width: '72%'}}>
                  <TouchableWithoutFeedback
                    onPress={this.update_profile}
                    style={{padding: 15, alignItems: 'center'}}>
                    <View style={{padding: 15, alignItems: 'center'}}>
                      <Text style={{color: colors.theme_fg_three}}>Update</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </LinearGradient>
              )}
            </View>
          </View>
        </ScrollView>
        <Loader visible={isLoding} />

        {/* </ScrollView> */}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.profile.isLoding,
    message: state.profile.message,
    status: state.profile.status,
    data: state.profile.data,
    profile_picture: state.profile.profile_picture,
  };
}

const mapDispatchToProps = (dispatch) => ({
  editServiceActionPending: () => dispatch(editServiceActionPending()),
  editServiceActionError: (error) => dispatch(editServiceActionError(error)),
  editServiceActionSuccess: (data) => dispatch(editServiceActionSuccess(data)),
  updateServiceActionPending: () => dispatch(updateServiceActionPending()),
  updateServiceActionError: (error) =>
    dispatch(updateServiceActionError(error)),
  updateServiceActionSuccess: (data) =>
    dispatch(updateServiceActionSuccess(data)),
  updateProfilePicture: (data) => dispatch(updateProfilePicture(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: colors.theme_bg,
  },
  icon: {
    color: colors.theme_bg_three,
  },
  header_body: {
    flex: 3,
    justifyContent: 'center',
  },
  title: {
    alignSelf: 'center',
    color: colors.theme_bg_three,
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  page_background: {
    backgroundColor: colors.theme_bg_three,
  },
  header_section: {
    width: '100%',
    height: height_35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile_image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderColor: colors.theme_bg_three,
    borderWidth: 1,
  },
  profile_name: {
    color: colors.theme_bg,
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  body_section: {
    flex: 1,
    width: '100%',
    height: height_40,
    backgroundColor: colors.theme_bg_three,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -15,
  },
  input: {
    height: 40,
    width: '80%',
    marginVertical: 10,
  },
  text_input: {
    borderBottomWidth: 1,
    borderBottomColor: '#666',
    padding: 10,
    borderRadius: 5,
    fontFamily: 'SFUIDisplay-Light',
  },
  footer_section: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  btn_style: {
    backgroundColor: colors.theme_bg,
  },
});
