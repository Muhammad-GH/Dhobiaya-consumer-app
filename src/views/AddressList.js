import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Icon,
  Footer,
  Col,
  Row,
} from 'native-base';
import {Button} from 'react-native-elements';
import axios from 'axios';
import {connect} from 'react-redux';
import {Loader} from '../components/GeneralComponents';
import {
  listServiceActionPending,
  listServiceActionError,
  listServiceActionSuccess,
  deleteServiceActionPending,
  deleteServiceActionError,
  deleteServiceActionSuccess,
} from '../actions/AddressListActions';
import {
  selectAddress,
  specialRequest,
  ConfirmOrder,
} from '../actions/CartActions';
import {
  api_url,
  address_list,
  address_delete,
  img_url,
  height_30,
  no_data,
  place_order,
  check_icon,
} from '../config/Constants';
import {ConfirmDialog} from 'react-native-simple-dialogs';
import * as colors from '../assets/css/Colors';
import {
  orderServicePending,
  orderServiceError,
  orderServiceSuccess,
} from '../actions/PaymentActions';
import {reset} from '../actions/CartActions';
import {productReset} from '../actions/ProductActions';
import {ConfirmOrderEdit} from '../actions/CartActions';
import {NavigationActions} from 'react-navigation';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import Overlay from 'react-native-modal-overlay';
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

const ScreenHeight = Math.round(Dimensions.get('window').height);
const ScreenWidth = Math.round(Dimensions.get('window').width);

var id;
var address;

class AddressList extends Component<Props> {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      dialogVisible: false,
      deleting_address: 0,
      payment_mode: 1,
      from: this.props.navigation.getParam('from'),
      isBack: this.props.navigation.getParam('isBack'),
      isModalOpen: false,
      slelected: true,
      addressSelected: true,
      isModalOpen: false,
      id: null,
    };
  }

  async componentDidFocus() {
    this.address_list();
  }

  componentWillUnmount() {
    this.subs.forEach((sub) => sub.remove());
  }

  async componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', (payload) =>
        this.componentDidFocus(payload),
      ),
    ];
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  address_list = async () => {
    this.setState({dialogVisible: false});
    this.props.deleteServiceActionPending();
    await axios({
      method: 'post',
      url: api_url + address_list,
      data: {customer_id: global.id},
    })
      .then(async (response) => {
        await this.props.deleteServiceActionSuccess(response.data);
      })
      .catch((error) => {
        this.props.deleteServiceActionError(error);
      });
  };

  address_delete = async () => {
    this.setState({dialogVisible: false});
    this.props.deleteServiceActionPending();
    await axios({
      method: 'post',
      url: api_url + address_delete,
      data: {customer_id: global.id, address_id: this.state.deleting_address},
    })
      .then(async (response) => {
        await this.props.deleteServiceActionSuccess(response.data);
        await this.setState({deleting_address: 0});
      })
      .catch((error) => {
        this.props.deleteServiceActionError(error);
      });
  };

  open_popup(id) {
    this.setState({dialogVisible: true, deleting_address: id});
  }

  close_popup() {
    this.setState({dialogVisible: false, deleting_address: 0});
  }

  handleBackButtonClick = async () => {
    // alert('k')
    // console.log('addressSelected', this.state.addressSelected)
    // console.log('edite_address========================>', id)
    // console.log('edite_address========================>', address)
    let obj = {
      id,
      address,
    };
    if (this.state.addressSelected) {
      // console.log('IF')
      await this.props.selectAddress(obj);
      // await this.props.ConfirmOrderEdit()
      await this.props.ConfirmOrder();
      await this.props.navigation.goBack(null);
      // alert('if')
    } else if (this.state.isBack) {
      this.props.navigation.goBack(null);
    } else {
      this.setState({
        isModalOpen: true,
      });
      // console.log('ELSE')
      // await this.props.selectAddress(this.state.id);
      // await this.props.ConfirmOrder()
      // await this.props.ConfirmOrderEdit()
      // this.props.navigation.goBack(null);
      // alert('else')
    }
  };

  add_address = () => {
    this.props.navigation.navigate('Address', {id: 0});
  };

  edit_address = (id) => {
    this.props.navigation.navigate('Address', {id: id});
  };

  select_address_Selected = async (id) => {
  };

  select_address = async (data) => {
    await this.props.selectAddress(data);
    await this.props.ConfirmOrder();
    await this.props.navigation.navigate('Cart')
  };

  place_order = async () => {
    this.props.orderServicePending();
    await axios({
      method: 'post',
      url: api_url + place_order,
      data: {
        special_requests: this.props.special_request,
        customer_id: global.id,
        payment_mode: this.state.payment_mode,
        address_id: this.props.address,
        expected_delivery_date: this.props.delivery_date,
        total: this.props.total,
        discount: this.props.discount,
        sub_total: this.props.sub_total,
        promo_id: this.props.promo_id,
        items: JSON.stringify(Object.values(this.props.items)),
      },
    })
      .then(async (response) => {
        await this.props.orderServiceSuccess(response.data);
        // await this.setState({ isModalOpen: true })
        // await this.move_orders();
      })
      .catch((error) => {
        this.props.orderServiceError(error);
      });
  };

  goToHome = async () => {
    await this.props.reset();
    await this.props.productReset();
    const navigateAction = NavigationActions.navigate({routeName: 'Home'});
    this.props.navigation.dispatch(navigateAction);
  };

  goToOrder = async () => {
    await this.props.reset();
    await this.props.productReset();
    const navigateAction = NavigationActions.navigate({routeName: 'MyOrders'});
    this.props.navigation.dispatch(navigateAction);
  };

  d_Selected = async () => {
    let obj = {
      id: null,
      address: null,
    };
    this.setState({
      slelected: false,
      id: null,
      addressSelected: false,
    });
    await this.props.selectAddress(obj);
  };

  render() {
    const {isLoding, error, data, addressText, status, address_count} = this.props;
    const address_list = data.map((row, key) => {
      (id = row.id), (address = row.address);
      return (
        <View
          style={[
            styles.address_content,
            {
              backgroundColor:
                address === addressText
                  ? '#91deff'
                  : colors.theme_bg_three,
            },
          ]}>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <Left style={{}}>
              <Text style={styles.address_title}>Address #{key + 1}</Text>
            </Left>
            {address === addressText ? (
              <Right style={{flexDirection: 'row', right: 0}}>
                <Text style={{top: -8, color: '#0095cc', fontSize: 15}}>
                  Your Primary Address
                </Text>
                <Image
                  // source={check_icon}
                  source={require('../assets/checkmaplist.png')}
                  style={{width: 40, height: 35}}
                  resizeMode="contain"
                />
              </Right>
            ) : null}
          </View>
          <View style={styles.static_map}>
            <Image
              style={{
                flex: 1,
                width: undefined,
                height: undefined,
                opacity:
                  address === addressText ? 0.6 : null,
                backgroundColor: '#000',
              }}
              source={{uri: img_url + row.static_map}}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Left>
              <Text style={styles.address}>{row.address}</Text>
            </Left>
          </View>

          <View style={styles.address_footer}>
            <LinearGradient
              colors={['#00aeef', '#9fd8ed']}
              style={{
                borderRadius: 25,
                width: '27%',
                height: 30,
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={true ? 0.7 : 0.3}
                onPress={this.edit_address.bind(this, row.id)}
                style={{padding: 5, alignItems: 'center', borderRadius: 25}}
                // style={[styles.addressFooterBtn,{marginHorizontal:20}]}
              >
                <Text style={styles.btn}>Edit</Text>
              </TouchableOpacity>
            </LinearGradient>
            <LinearGradient
              colors={['#00aeef', '#9fd8ed']}
              style={{
                borderRadius: 25,
                marginHorizontal: 20,
                width: '27%',
                height: 30,
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={true ? 0.7 : 0.3}
                onPress={this.open_popup.bind(this, row.id)}
                style={{padding: 5, alignItems: 'center', borderRadius: 35}}>
                <Text style={styles.btn}>Delete</Text>
              </TouchableOpacity>
            </LinearGradient>
            {address === addressText ? (
              <LinearGradient
                onPress={
                  address === addressText ? this.select_address_Selected.bind(this) : null
                }
                colors={['#00aeef', '#9fd8ed']}
                style={{
                  borderRadius: 25,
                  width: '27%',
                  height: 30,
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  activeOpacity={true ? 0.7 : 0.3}
                  onPress={this.d_Selected}
                  style={{padding: 5, alignItems: 'center', borderRadius: 35}}>
                  <Text style={styles.btn}>De Selected</Text>
                </TouchableOpacity>
              </LinearGradient>
            ) : (
              <LinearGradient
                colors={['#00aeef', '#9fd8ed']}
                style={{
                  borderRadius: 25,
                  width: '27%',
                  height: 30,
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  activeOpacity={true ? 0.7 : 0.3}
                  onPress={this.select_address.bind(this, row)}
                  style={{padding: 5, alignItems: 'center', borderRadius: 35}}>
                  <Text style={styles.btn}>Select</Text>
                </TouchableOpacity>
              </LinearGradient>
            )}
          </View>
        </View>
      );
    });

    return (
      <Container style={{backgroundColor: colors.theme_bg_two}}>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header}>
          <Left style={{flex: 1}}>
            <TouchableOpacity
              onPress={this.handleBackButtonClick}
              style={{width: '50%'}}>
              <Image
                source={require("../assets/arrowleft.png")}
                style={{
                  tintColor: colors.theme_fg_two,
                  height: wp("3%"),
                  width: wp("3%"),
                  resizeMode: 'contain'
                }}
              />
            </TouchableOpacity>
          </Left>
          <Body style={styles.header_body}>
            <Title
              style={{
                alignSelf: 'center',
                color: '#202028',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              MANAGE ADDRESSES
            </Title>
          </Body>
          <Right/>
        </Header>
        <ScrollView>
          <View style={styles.container}>
            <View>
              <Text style={styles.your_address}>
                {address_count === 0 ? 'ADD AN ADDRESS' : 'YOUR ADDRESSES'}
              </Text>
            </View>
            {address_count === 0 ? (
              <View style={{marginTop: height_30}}></View>
            ) : (
              address_list
            )}
          </View>
        </ScrollView>

        <Overlay
          visible={this.state.isModalOpen}
          animationType="fadeIn"
          animationIn="slideInUp"
          childrenWrapperStyle={{borderRadius: 5}}
          containerStyle={{backgroundColor: 'rgba(20, 5, 33, 0.28)'}}
          animationType="zoomIn"
          animationDuration={500}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              onPress={() => {
                this.setState({isModalOpen: false});
              }}
              style={{flexDirection: 'row-reverse'}}>
              <Icon name={'close'} type={'AntDesign'} color={'#666'}/>
            </TouchableOpacity>
            <View
              style={{
                alignItems: 'center',
                marginTop: 20,
                alignSelf: 'center',
                marginHorizontal: 20,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  color: colors.theme_text,
                  textAlign: 'center',
                }}>
                Please Select your{' '}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: colors.theme_text,
                  textAlign: 'center',
                }}>
                {' '}
                Primary Address
              </Text>
            </View>
            {/* <View style={styles.orderMessage}>
              <Text style={{ textAlign: 'center', alignSelf:'center'}}>
                Your order has been successfully added
              </Text>
            </View> */}
          </View>
        </Overlay>

        <Footer style={styles.footer}>
          <View style={styles.footer_content}>
            <LinearGradient
              colors={['#00aeef', '#9fd8ed']}
              style={{borderRadius: 25}}>
              <TouchableOpacity
                activeOpacity={true ? 0.7 : 0.3}
                onPress={this.add_address}
                style={{padding: 12, alignItems: 'center'}}>
                <Text style={{color: colors.theme_fg_three}}>
                  ADD NEW ADDRESS
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Footer>

        <Loader visible={isLoding}/>
        <ConfirmDialog
          title="Confirm Dialog"
          message="Are you sure about that?"
          animationType="fade"
          visible={this.state.dialogVisible}
          onTouchOutside={() => this.setState({dialogVisible: false})}
          positiveButton={{
            title: 'YES',
            onPress: this.address_delete,
            titleStyle: {
              color: colors.theme_fg,
            },
          }}
          negativeButton={{
            title: 'NO',
            onPress: () => this.setState({dialogVisible: false}),
            titleStyle: {
              color: colors.theme_fg,
            },
          }}
        />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.address_list.isLoding,
    message: state.address_list.isLoding,
    status: state.address_list.isLoding,
    data: state.address_list.data,
    address_count: state.address_list.address_count,
    special_request: state.cart.special_request,
    address: state.cart.address,
    addressText: state.cart.addressText,
    delivery_date: state.cart.delivery_date,
    total: state.cart.total_amount,
    sub_total: state.cart.sub_total,
    discount: state.cart.promo_amount,
    promo_id: state.cart.promo_id,
    items: state.product.cart_items,
  };
}

const mapDispatchToProps = (dispatch) => ({
  reset: () => dispatch(reset()),
  productReset: () => dispatch(productReset()),
  orderServicePending: () => dispatch(orderServicePending()),
  orderServiceError: (error) => dispatch(orderServiceError(error)),
  orderServiceSuccess: (data) => dispatch(orderServiceSuccess(data)),
  listServiceActionPending: () => dispatch(listServiceActionPending()),
  listServiceActionError: (error) => dispatch(listServiceActionError(error)),
  listServiceActionSuccess: (data) => dispatch(listServiceActionSuccess(data)),
  deleteServiceActionPending: () => dispatch(deleteServiceActionPending()),
  deleteServiceActionError: (error) =>
    dispatch(deleteServiceActionError(error)),
  deleteServiceActionSuccess: (data) =>
    dispatch(deleteServiceActionSuccess(data)),
  selectAddress: (data) => dispatch(selectAddress(data)),
  ConfirmOrder: () => dispatch(ConfirmOrder()),
  ConfirmOrderEdit: () => dispatch(ConfirmOrderEdit()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddressList);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  address_content: {
    width: '100%',
    padding: 20,
    // backgroundColor: colors.theme_bg_three,
    marginBottom: 0,
  },
  address_title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.theme_fg_two, fontFamily: 'SFUIDisplay-Light',
  },
  static_map: {
    height: 100,
    width: '100%',
    marginTop: 10,
  },
  address: {
    fontSize: 13,
    marginTop: 5,
  },
  address_footer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
    // justifyContent:'space-evenly'
  },
  btn: {
    fontSize: 12,
    fontWeight: 'bold',
    // color: colors.theme_fg
    color: colors.theme_bg_three,
    padding: 5,
    textAlign: 'center',
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
    color: '#202028',
    fontSize: 16,
    fontWeight: 'bold',
  },
  your_address: {
    fontSize: 12,
    margin: 10,
  },
  modalCard: {
    backgroundColor: colors.theme_bg_three,
    // alignItems: 'center',
    width: '100%',
    height: '20%',
    borderRadius: 15,
    top: -15,
    right: -10,
  },
  orderMessage: {
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginHorizontal: 20,
    width: '80%',
  },
  gotoOrderBtn: {
    backgroundColor: colors.theme_bg,
    borderRadius: 25,
    paddingHorizontal: 45,
    marginTop: 15,
    paddingVertical: 15,
  },
  footer: {
    backgroundColor: colors.theme_bg_three,
    height: 70,
  },
  footer_content: {
    width: '72%',
    justifyContent: 'center',
    margin: 15,
  },
  addressFooterBtn: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: colors.theme_bg,
    width: '25%',
    backgroundColor: colors.theme_bg,
    color: colors.theme_bg_three,
  },
  add_address: {
    backgroundColor: colors.theme_bg,
  },
});
