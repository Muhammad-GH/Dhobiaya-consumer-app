import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Animated,
  Dimensions,
  FlatList,
  BackHandler,
  Fragment,
} from 'react-native';

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import Dialog, {
  DialogContent,
  SlideAnimation,
  DialogTitle,
  DialogFooter,
  DialogButton,
} from 'react-native-popup-dialog';

import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Icon,
  Row,
  Footer,
  Col,
  List,
  ListItem,
  CardItem,
  CheckBox,
  Content,
} from 'native-base';
import {Button, Divider} from 'react-native-elements';
import {Loader} from '../components/GeneralComponents';
import {connect} from 'react-redux';
import {
  subTotal,
  total,
  calculatePricing,
  selectDate,
  specialRequest,
  reset,
  showEditBtn,
  ConfirmOrderEdit,
  selectAddress,
} from '../actions/CartActions';
import {
  orderServicePending,
  orderServiceError,
  orderServiceSuccess,
} from '../actions/PaymentActions';
import {
  productReset,
  addToCartfordelete,
  addToCart,
  addToCartforUndelete,
  totalItemsDelete,
  totalKGsDelete,
  addTotalItemsMinus,
} from '../actions/ProductActions';
import {
  listServiceActionPending,
  listServiceActionError,
  listServiceActionSuccess,
} from '../actions/AddressListActions';
import {
  api_url,
  address_list,
  place_order,
  delete_icon,
} from '../config/Constants';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {NavigationActions} from 'react-navigation';
import Snackbar from 'react-native-snackbar';
import * as colors from '../assets/css/Colors';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import Overlay from 'react-native-modal-overlay';
import moment from 'moment';
import axios from 'axios';
import ToggleSwitch from 'toggle-switch-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

var Sound = require('react-native-sound');

var sound1;

var count_1 = 0;
var count_C = false;
var count_C = false;
var is_Condition = true;
var count_2 = 0;
var count_3 = 0;
var totalRupes;

const showDatePicker = () => {
  setDatePickerVisibility(true);
};

const hideDatePicker = () => {
  setDatePickerVisibility(false);
};

const handleConfirm = (time) => {
  setHours(time.getHours());
  setMinutes(time.getMinutes());
  hideDatePicker();
};

class Cart extends Component<Props> {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      deliveryDatePickerVisible: false,
      special_request: '',
      payment_mode: 1,
      isModalOpen: false,
      isFold: false,
      mp3: require('../assets/tune/pop_tune.mp3'),
      date: this.props.date,
      time: null,
      count: 0,
      checked: true,
      isConfirm: this.props.isConfirm,
      aboveKg: false,
      myCart: {},
      removeKeys: [],
      loading: false,
    };
  }

  myBindedFunction(param1, param2) {
    alert('a');
  }

  get_address_list = async () => {
    this.props.listServiceActionPending();
    await axios({
      method: 'post',
      url: api_url + address_list,
      data: {customer_id: global.id},
    })
      .then(async (response) => {
        if (response.data.result.length > 0) {
          this.props.selectAddress({
            id: response.data.result[0].id,
            address: response.data.result[0].address,
          });
        }
        console.warn('response: ');
        await this.props.listServiceActionSuccess(response.data);
      })
      .catch((error) => {
        this.props.listServiceActionError(error);
      });
  };

  async componentDidFocus() {
    this.calculate_total();
    // this.props.ConfirmOrderEdit()
  }

  componentWillUnmount() {
    this.subs.forEach((sub) => sub.remove());
  }

  async componentDidMount() {
    // myCart
    const {params} = this.props.navigation.state;
    this.setState({
      myCart: params.myCart,
    });
    this.get_address_list();
    this.subs = [
      this.props.navigation.addListener('didFocus', (payload) =>
        this.componentDidFocus(payload),
      ),
    ];
    // BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  showDeliveryDatePicker = () =>
    this.setState({deliveryDatePickerVisible: true});
  hideDeliveryDatePicker = () =>
    this.setState({deliveryDatePickerVisible: false});
  handleDeliveryDatePicked = async (date) => {
    console.log('handleDeliveryDatePicked', moment(date).format('llll'));
    var d = new Date(date);
    var m = (parseInt((d.getMinutes() + 7.5) / 15) * 15) % 60;
    let delivery_date =
      d.getDate() +
      '/' +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      '/' +
      d.getFullYear();
    this.hide(delivery_date);
    this.props.selectDate(delivery_date);

    this.props.showEditBtn(false);
    console.log(this.state.time === '', 43);
    this.setState({visible: true});
  };

  hide = async () => {
    await this.hideDeliveryDatePicker();
  };

  calculate_total() {
    this.props.calculatePricing();
    promo = this.props.promo;
    if (promo == undefined) {
      this.props.total({promo_amount: 0, total: this.props.sub_total});
    } else {
      if (promo.promo_type == 1) {
        this.props.total({
          promo_amount: promo.discount,
          total: this.props.sub_total - promo.discount,
        });
      } else {
        let discount = (promo.discount / 100) * this.props.sub_total;
        this.props.total({
          promo_amount: discount,
          total: this.props.sub_total - discount,
        });
      }
    }
  }

  handleBackButtonClick = () => {
    const {myCart} = this.props.navigation.state.params;
    if (
      myCart &&
      Object.keys(myCart).length === 0 &&
      myCart.constructor === Object
    ) {
      this.props.navigation.navigate('Home');
    } else {
      this.props.navigation.navigate('Dashboard');
    }
  };

  address_list = () => {
    this.props.navigation.navigate('AddressList');
  };

  select_address_1 = async () => {
    this.props.navigation.navigate('AddressList', {from: 'cart'});
  };

  place_order = async (subTotal, totalKgs, totalRupes) => {
    this.setState({
      loading: true,
    });
    if (
      this.props.delivery_date != undefined &&
      this.props.addressText !== null
    ) {
      const {myCart} = this.state;
      this.props.orderServicePending();

      let data = {
        special_requests: this.props.special_request,
        customer_id: global.id,
        payment_mode: this.state.payment_mode,
        address_id: this.props.address,
        expected_delivery_date: `${this.props.delivery_date} : ${this.state.time}`,
        total: totalRupes,
        discount: this.props.discount,
        sub_total: subTotal,
        promo_id: this.props.promo_id,
        items: JSON.stringify(Object.values(myCart)),
        extra_service: this.state.isFold ? 1 : 0,
        extra_charges: 300,
        unit: 'kg',
        delivery_charges: this.state.isFold ? 0 : totalKgs > 6 ? 0 : 150,
      };

      // axios
      await axios({
        method: 'post',
        url: api_url + place_order,
        data,
      })
        .then(async (response) => {
          console.warn(response.data);
          await this.props.orderServiceSuccess(response.data);
          await this.setState({isModalOpen: true, loading: false});
          await this.playSound();
          await this.props.reset();
          this.props.navigation.state.params.clearCart();
          // await this.move_orders();
        })
        .catch((error) => {
          console.warn(error.response.data);
          this.props.orderServiceError(error);
        });
    } else if (this.props.addressText === null) {
      this.showSnackbar('Please select address ');
    } else if (this.props.delivery_date === undefined) {
      this.showSnackbar('Please choose delivery date');
    }
  };

  showSnackbar(msg) {
    Snackbar.show({
      title: msg,
      duration: Snackbar.LENGTH_SHORT,
    });
  }

  promo = () => {
    this.props.navigation.navigate('Promo');
  };

  setMenuRef = (ref) => {
    this._menu = ref;
  };

  showMenu = () => {
    this._menu.show();
  };

  playSound = () => {
    // alert('a')
    Sound.setCategory('Playback');

    let sound1 = new Sound(this.state.mp3, (error, sound) => {
      if (error) {
        return;
      }
      sound1.play(() => {
        sound1.release();
      });
    });
  };

  goToOrder = async () => {
    await this.props.reset();
    await this.props.productReset();
    const navigateAction = NavigationActions.navigate({routeName: 'MyOrders'});

    this.props.navigation.dispatch(navigateAction);
    this.setState({isModalOpen: false});
  };

  toggle = (p) => {
    this.setState({
      isFold: !this.state.isFold,
    });
  };

  add_deleteCart = async (data, isCondition) => {
    const {removeKeys} = this.state;
    let key = `${data.service_id}-${data.service_type}-${data.product_id}`;
    let itemIndex = removeKeys.indexOf(key);
    if (itemIndex > -1) {
      removeKeys.splice(itemIndex, 1);
    } else {
      removeKeys.push(key);
    }
    this.setState({removeKeys});
  };

  deleteAllSelectItem = async () => {
    const {removeKeys, myCart} = this.state;
    removeKeys.forEach((item, index) => {
      delete myCart[item];
    });
    this.setState({
      myCart,
      removeKeys: [],
    });
  };

  render() {
    const {isLoding, promo_amount, promo, delivery_date} = this.props;
    const {myCart, removeKeys} = this.state;
    let totalKgs = 0;
    totalKgs = Object.values(myCart).reduce((acc, el) => {
      if (el) {
        acc += el.qty * el.per_unit_kg;
        return acc;
      }
    }, 0);
    totalKgs = totalKgs.toFixed(2);
    let subTotal = Object.values(myCart).reduce((acc, el) => {
      if (el) {
        acc += el.service_charge * el.qty;
        return acc;
      }
    }, 0);
    let isFoldCost = this.state.isFold ? 300 : 0;
    totalRupes =
      totalKgs >= 6
        ? subTotal + isFoldCost
        : subTotal + (this.state.isFold ? 300 : 150);
    let cartData = Object.values(myCart).reduce((acc, el) => {
      let key = el.service_name;
      if (!Object.keys(acc).includes(key)) {
        acc[key] = [];
      }
      acc[key].push(el);
      return acc;
    }, {});
    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header}>
          <Left style={{flex: 1}}>
            <TouchableOpacity
              onPress={this.handleBackButtonClick}
              style={{width: '70%'}}>
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
            <Title style={styles.title}>Cart</Title>
          </Body>
          <Right>
            <Icon
              onPress={this.handleBackButtonClick}
              ref={this.setMenuRef}
              onPress={this.showMenu}
              style={{fontSize: 23}}
              name="dots-three-vertical"
              type="Entypo"
            />
            <Menu ref={this.setMenuRef}>
              <MenuItem
                textStyle={{fontSize: 14}}
                onPress={() => {
                  this.props.navigation.navigate('Dashboard');
                }}>
                Home
              </MenuItem>
              <MenuDivider />
              <MenuItem
                textStyle={{fontSize: 14}}
                onPress={() => {
                  this.props.navigation.navigate('MyOrders');
                }}>
                My Order
              </MenuItem>
              <MenuDivider />
              <MenuItem
                textStyle={{fontSize: 14}}
                onPress={() => {
                  this.props.navigation.navigate('Profile');
                }}>
                Profile
              </MenuItem>
              <MenuDivider />
              <MenuItem
                textStyle={{fontSize: 14}}
                onPress={() => {
                  this.props.navigation.navigate('More');
                }}>
                More
              </MenuItem>
            </Menu>
          </Right>
        </Header>
        <ScrollView>
          <Divider style={{backgroundColor: colors.theme_fg_two}} />
          <Row style={{padding: 10}}>
            <Left>{/* <Text>Your cloths</Text> */}</Left>
            <Body>
              <Text
                style={{
                  fontFamily: 'SFUIDisplay-Medium',
                  fontWeight: 'bold',
                }}>
                Order Summary
              </Text>
            </Body>
            <Right>
              {removeKeys.length > 0 ? (
                <TouchableOpacity
                  activeOpacity={true ? 0.7 : 0.3}
                  onPress={this.deleteAllSelectItem}>
                  <Image
                    source={delete_icon}
                    style={{width: 25, height: 25}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ) : null}
            </Right>
          </Row>

          <Content>
            {Object.keys(cartData).map((value, index) => {
              return (
                <View
                  key={index}
                  style={{
                    borderBottomColor: '#DCDCDC',
                    borderBottomWidth: 1,
                  }}>
                  <Row
                    style={{
                      marginLeft: 7,
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'SFUIDisplay-Medium',
                        fontWeight: 'bold',
                        color: colors.theme_bg,
                      }}>
                      {value}
                    </Text>
                  </Row>
                  {cartData[value].map((item, index) => {
                    const {removeKeys} = this.state;
                    let key = `${item.service_id}-${item.service_type}-${item.product_id}`;
                    return (
                      <Row
                        key={index}
                        style={{
                          padding: 10,
                          backgroundColor: removeKeys.includes(key)
                            ? '#bce5f5'
                            : null,
                        }}>
                        <Col
                          style={{
                            width: 25,
                            right: 10,
                            marginHorizontal: 5,
                            alignItems: 'center',
                          }}>
                          <CheckBox
                            onPress={() =>
                              this.add_deleteCart(item, is_Condition)
                            }
                            checked={removeKeys.includes(key)}
                            // value={true}
                            size={20}
                            style={{
                              color: colors.theme_fgL,
                              borderColor: colors.theme_bg,
                            }}
                          />
                        </Col>
                        <Col style={{width: 25}}>
                          <Text style={styles.qty}>{item.qty} x</Text>
                        </Col>
                        <Row style={{alignItems: 'center'}}>
                          <Text
                            style={{
                              fontFamily: 'SFUIDisplay-Medium',
                            }}>
                            {item.product_name}
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'SFUIDisplay-Medium',
                              fontSize: 12,
                            }}>
                            {' '}
                            ({(item.per_unit_kg * item.qty).toFixed(2)} kgs x
                            Rs. {item.service_charge})
                          </Text>
                        </Row>
                        <Text
                          style={{
                            fontFamily: 'SFUIDisplay-Medium',
                          }}>
                          Rs. {item.service_charge}
                        </Text>
                      </Row>
                    );
                  })}
                </View>
              );
            })}
          </Content>

          {this.props.navigation.state.params.myCart &&
          Object.keys(this.props.navigation.state.params.myCart).length === 0 &&
          this.props.navigation.state.params.myCart.constructor ===
            Object ? null : promo === undefined ? (
            <Row
              style={{
                padding: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Col style={{width: 50}}>
                <Image
                  source={require('../assets/pricetag.png')}
                  style={{
                    height: wp('7%'),
                    width: wp('7%'),
                  }}
                />
              </Col>
              <Col>
                <Text
                  style={{
                    fontFamily: 'SFUIDisplay-Medium',
                    fontSize: 12,
                  }}>
                  No promotion applied.Choose your promotion here.
                </Text>
                <Text
                  onPress={() => this.promo()}
                  style={styles.choose_promotion}>
                  Choose promotion
                </Text>
              </Col>
            </Row>
          ) : (
            <Row
              style={{
                padding: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Col style={{width: 50}}>
                <Image
                  source={require('../assets/pricetag.png')}
                  style={{
                    height: wp('7%'),
                    width: wp('7%'),
                  }}
                />
              </Col>
              <Col>
                <Text style={styles.promotion_applied}>Promotion applied</Text>
                <Text
                  style={{
                    fontFamily: 'SFUIDisplay-Medium',
                    fontSize: 12,
                  }}>
                  You are saving {global.currency}
                  {promo_amount}
                </Text>
                <Text onPress={() => this.promo()} style={styles.change_promo}>
                  Change promo
                </Text>
              </Col>
            </Row>
          )}

          <Divider style={{backgroundColor: colors.theme_fg_two}} />
          <Row style={styles.sub_total}>
            <Col>
              <Text
                style={{fontFamily: 'SFUIDisplay-Light', fontWeight: 'bold'}}>
                Total Kgs
              </Text>
            </Col>
            <Col
              style={{
                flexWrap: 'wrap-reverse',
                marginLeft: 0,
                alignContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'SFUIDisplay-Light',
                  fontWeight: '600',
                  alignContent: 'center',
                }}>
                {totalKgs} Kgs
              </Text>
            </Col>
          </Row>
          <Row style={styles.sub_total}>
            <Col>
              <Text
                style={{fontFamily: 'SFUIDisplay-Light', fontWeight: 'bold'}}>
                Subtotal
              </Text>
            </Col>
            <Col style={{alignItems: 'flex-end'}}>
              <Text style={{fontFamily: 'SFUIDisplay-Light'}}>
                Rs.{subTotal}
              </Text>
            </Col>
          </Row>
          <Row style={styles.discount}>
            <Col>
              <Text
                style={{fontFamily: 'SFUIDisplay-Light', fontWeight: 'bold'}}>
                Discount
              </Text>
            </Col>
            <Col style={{alignItems: 'flex-end'}}>
              <Text style={{fontFamily: 'SFUIDisplay-Light'}}>
                {/* {global.currency} */}
                Rs.{promo_amount}
              </Text>
            </Col>
          </Row>
          <Row style={[styles.discount]}>
            <Col style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: 'SFUIDisplay-Light',
                  fontWeight: 'bold',
                  marginRight: 10,
                }}>
                Extra Service (Hanger)
              </Text>
              <Text
                style={{
                  fontFamily: 'SFUIDisplay-Light',
                  fontWeight: 'bold',
                  color: colors.theme_bg,
                }}>
                Rs.300{' '}
              </Text>
            </Col>
            <Col style={{flexWrap: 'wrap-reverse'}}>
              <ToggleSwitch
                isOn={this.state.isFold}
                onColor={colors.theme_bg}
                offColor={'#bbb'}
                size="big"
                onToggle={this.toggle}
              />
            </Col>
          </Row>

          <Row style={styles.delievery}>
            <Col
              style={{
                width: '70%',
              }}>
              <Text
                style={{fontFamily: 'SFUIDisplay-Light', fontWeight: 'bold'}}>
                Delivery Charges
              </Text>
              <Text
                style={{
                  fontFamily: 'SFUIDisplay-Light',
                  color: colors.theme_bg,
                  fontSize: 12,
                }}>
                There are no delivery charges for orders above 6 Kgs
              </Text>
            </Col>

            <Col style={{alignItems: 'flex-end'}}>
              <Text
                style={[
                  {
                    fontFamily: 'SFUIDisplay-Light',
                    position: 'absolute',
                    textDecorationLine: this.state.isFold
                      ? 'line-through'
                      : totalKgs > 6
                      ? 'line-through'
                      : 'none',
                    color: this.state.isFold
                      ? 'red'
                      : totalKgs > 6
                      ? 'red'
                      : undefined,
                  },
                ]}>
                Rs. 150
              </Text>
            </Col>
          </Row>
          <Row style={styles.total}>
            <Col>
              <Text
                style={{fontFamily: 'SFUIDisplay-Light', fontWeight: 'bold'}}>
                Total
              </Text>
            </Col>
            <Text style={{fontFamily: 'SFUIDisplay-Light'}}>
              Rs. {totalRupes}
            </Text>
          </Row>
          <Divider style={{backgroundColor: colors.theme_fg_two}} />
          {/* ============== ADDRESS SECTION =============== */}
          {this.props.addressText ? (
            <React.Fragment>
              <Row style={{marginHorizontal: 20, paddingTop: 15}}>
                <Text
                  style={{fontFamily: 'SFUIDisplay-Light', fontWeight: 'bold'}}>
                  Address
                </Text>
              </Row>
              <Row
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 20,
                  marginTop: -20,
                }}>
                <Col></Col>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity onPress={this.select_address_1}>
                    <Text
                      style={{
                        color: colors.theme_bg,
                        marginRight: 2,
                        top: 10,
                        right: 4,
                        fontFamily: 'SFUIDisplay-Light',
                      }}>
                      Edit Address
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.select_address_1}>
                    <Image
                      source={require('../assets/edit_address.png')}
                      style={{width: 30, height: 35}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                {/* </Col> */}
                {/* </Row> */}
                {/* </Col> */}
              </Row>
              <Row>
                <View>
                  <TextInput
                    style={{
                      marginHorizontal: 15,
                      padding: 3,
                      color: colors.theme_bg,

                      textAlignVertical: 'auto',
                      fontFamily: 'SFUIDisplay-Light',
                    }}
                    placeholder="Special Request"
                    editable={false}
                    value={this.props.addressText}
                    // numberOfLines={10}
                    multiline={true}
                  />
                </View>
              </Row>
            </React.Fragment>
          ) : (
            <Row
              style={{
                flexDirection: 'row',
                marginHorizontal: 20,
                paddingTop: 15,
              }}>
              <Col>
                <View style={{flexDirection: 'column'}}>
                  <Text
                    style={{
                      fontFamily: 'SFUIDisplay-Light',
                      fontWeight: 'bold',
                    }}>
                    Address
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'SFUIDisplay-Light',
                      fontWeight: '400',
                      paddingTop: 10,
                    }}>
                    Select Address
                  </Text>
                </View>
              </Col>
              <TouchableOpacity onPress={this.select_address_1}>
                <Col>
                  <Image
                    source={require('../assets/add_btn.png')}
                    style={{width: 40, height: 45}}
                    resizeMode="contain"
                  />
                </Col>
              </TouchableOpacity>
            </Row>
          )}
          {/* ============== Pickup Time SECTION =============== */}
          <Row
            style={{
              flexDirection: 'row',
              marginHorizontal: 20,
              paddingTop: 15,
            }}>
            <Col>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    fontFamily: 'SFUIDisplay-Light',
                    fontWeight: 'bold',
                    paddingBottom: 10,
                    left: 5,
                  }}>
                  Select date / time slots
                </Text>

                {/* Time Selection Designs start here */}

                <View
                  style={{
                    width: '35%',
                    backgroundColor: '#fff',
                    flexDirection: 'row',
                    top: 15,
                  }}>
                  <View style={{width: '40%'}}>
                    <Dialog
                      style={{width: '40%'}}
                      visible={this.state.visible}
                      onTouchOutside={() => {
                        this.setState({visible: true});
                      }}
                      width={0.9}
                      dialogTitle={<DialogTitle title="Pickup Slot" />}
                      dialogAnimation={
                        new SlideAnimation({
                          slideFrom: 'bottom',
                        })
                      }
                      footer={
                        <DialogFooter>
                          <DialogButton
                            text="OK"
                            onPress={() => {
                              this.setState({
                                visible:
                                  this.state.time === null ? true : false,
                              });
                            }}
                          />
                        </DialogFooter>
                      }>
                      <DialogContent>
                        <View
                          style={{
                            flexDirection: 'row',
                            top: 10,
                            borderRadius: 25,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              justifyContent: 'space-between',
                              right: 10,
                            }}>
                            <LinearGradient
                              start={{x: 0, y: 1}}
                              end={{x: 0, y: 0}}
                              colors={['#00aeef', '#9fd8ed']}
                              style={{borderRadius: 25, margin: 2}}>
                              <TouchableOpacity
                                activeOpacity={true ? 0.7 : 0.3}
                                onPress={() => {
                                  this.setState({time: '11 am - 1 pm'});
                                }}
                                style={{padding: 12, alignItems: 'center'}}>
                                <Text
                                  style={{
                                    fontFamily: 'SFUIDisplay-Light',
                                    color: colors.theme_fg_three,
                                    fontWeight: 'bold',
                                  }}>
                                  11-1 PM
                                </Text>
                              </TouchableOpacity>
                            </LinearGradient>
                          </View>

                          <View style={{right: 5}}>
                          <LinearGradient
                              start={{x: 0, y: 1}}
                              end={{x: 0, y: 0}}
                              colors={['#00aeef', '#9fd8ed']}
                              style={{borderRadius: 25, margin: 2}}>
                              <TouchableOpacity
                                activeOpacity={true ? 0.7 : 0.3}
                                onPress={() => {
                                  this.setState({time: '1 pm - 3 pm'});
                                }}
                                style={{padding: 12, alignItems: 'center'}}>
                                <Text
                                  style={{
                                    fontFamily: 'SFUIDisplay-Light',
                                    color: colors.theme_fg_three,
                                    fontWeight: 'bold',
                                  }}>
                                  1-3 PM
                                </Text>
                              </TouchableOpacity>
                            </LinearGradient>
                          </View>

                          <View style={{}}>
                          <LinearGradient
                              start={{x: 0, y: 1}}
                              end={{x: 0, y: 0}}
                              colors={['#00aeef', '#9fd8ed']}
                              style={{borderRadius: 25, margin: 2}}>
                              <TouchableOpacity
                                activeOpacity={true ? 0.7 : 0.3}
                                onPress={() => {
                                  this.setState({time: '3 pm - 5 pm'});
                                }}
                                style={{padding: 12, alignItems: 'center'}}>
                                <Text
                                  style={{
                                    fontFamily: 'SFUIDisplay-Light',
                                    color: colors.theme_fg_three,
                                    fontWeight: 'bold',
                                  }}>
                                  3-5 PM
                                </Text>
                              </TouchableOpacity>
                            </LinearGradient>
                          </View>

                          <View style={{left: 5}}>
                          <LinearGradient
                              start={{x: 0, y: 1}}
                              end={{x: 0, y: 0}}
                              colors={['#00aeef', '#9fd8ed']}
                              style={{borderRadius: 25, margin: 2}}>
                              <TouchableOpacity
                                activeOpacity={true ? 0.7 : 0.3}
                                onPress={() => {
                                  this.setState({time: '5 pm - 7 pm'});
                                }}
                                style={{padding: 12, alignItems: 'center'}}>
                                <Text
                                  style={{
                                    fontFamily: 'SFUIDisplay-Light',
                                    color: colors.theme_fg_three,
                                    fontWeight: 'bold',
                                  }}>
                                  5-7 PM
                                </Text>
                              </TouchableOpacity>
                            </LinearGradient>
                          </View>
                        </View>
                      </DialogContent>
                    </Dialog>
                  </View>
                </View>

                {delivery_date != undefined ? (
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontWeight: '400',
                        paddingTop: 5,
                        top: 12,
                        color: colors.theme_bg,
                        fontFamily: 'SFUIDisplay-Light',
                      }}>
                      {delivery_date}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'SFUIDisplay-Light',
                        left: 200,
                        paddingTop: 5,
                        backgroundColor: colors.theme_bg,
                        color: '#fff',
                        top: 10,
                        padding: 5,
                        alignSelf: 'flex-end',
                        alignItems: 'flex-end',
                        borderRadius: 5,
                        textAlign: 'center',
                        width: '30%',
                        fontFamily: 'SFUIDisplay-Light',
                      }}>
                      {this.state.time}
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={{
                      fontFamily: 'SFUIDisplay-Light',
                      fontWeight: '400',
                      paddingTop: 5,
                    }}></Text>
                )}
              </View>
            </Col>
            <TouchableOpacity onPress={this.showDeliveryDatePicker}>
              <Col>
                {delivery_date != undefined ? (
                  <Image
                    source={require('../assets/picukp_date.png')}
                    style={{width: 30, height: 30}}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require('../assets/add_btn.png')}
                    style={{width: 40, height: 45}}
                    resizeMode="contain"
                  />
                )}
                <DateTimePicker
                  format="YYYY-MM-DD"
                  // disabledDates
                  isVisible={this.state.deliveryDatePickerVisible}
                  onConfirm={this.handleDeliveryDatePicked}
                  onCancel={this.hideDeliveryDatePicker}
                  // color={colors.theme_fg}
                  // style ={{backgroundColor: "blue",color:'#111'}}
                  minimumDate={new Date()}
                  mode="date"
                />
              </Col>
            </TouchableOpacity>
          </Row>

          {/* ============== Special Request SECTION =============== */}
          <View style={styles.special_request_container}>
            <TextInput
              style={styles.special_request}
              placeholder="Special Request"
              onChangeText={(TextInputValue) =>
                this.setState({special_request: TextInputValue})
              }
              // numberOfLines={10}
              multiline={true}
            />
          </View>
        </ScrollView>
        <Overlay
          visible={this.state.isModalOpen}
          animationIn="slideInUp"
          childrenWrapperStyle={{borderRadius: 25}}
          containerStyle={{backgroundColor: 'rgba(20, 5, 33, 0.38)'}}
          animationType="zoomIn"
          animationDuration={500}>
          <View style={styles.modalCard}>
            <Image
              source={require('../assets/logo02.png')}
              style={{width: 150, height: 160}}
              resizeMode="contain"
            />
            <View style={styles.orderMessage}>
              <Text
                style={{fontFamily: 'SFUIDisplay-Light', textAlign: 'center'}}>
                Your order has been successfully added
              </Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={this.goToOrder}
                style={styles.gotoOrderBtn}>
                <Text
                  style={{
                    fontFamily: 'SFUIDisplay-Light',
                    color: colors.theme_bg_three,
                  }}>
                  Go To My Orders
                </Text>
              </TouchableOpacity>
              <View
                style={{alignItems: 'center', marginTop: 20}}
                onPress={() => {
                  this.setState({isModalOpen: false});
                }}>
                <Image
                  source={require('../assets/tick.png')}
                  style={{width: 30, height: 30}}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </Overlay>

        <Footer style={styles.footer}>
          <View style={styles.footer_content}>
            {/* {
              this.props.isConfirm === 1 ? */}
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 0, y: 0}}
              colors={
                this.props.addressText !== null &&
                this.props.delivery_date !== undefined
                  ? ['#00aeef', '#9fd8ed']
                  : ['#939191', '#ccc']
              }
              style={{borderRadius: 25, margin: 2}}>
              <TouchableOpacity
                activeOpacity={true ? 0.7 : 0.3}
                onPress={() => this.place_order(subTotal, totalKgs, totalRupes)}
                disabled={this.state.time === '' ? true : false}
                style={{padding: 12, alignItems: 'center'}}>
                <Text
                  style={{
                    fontFamily: 'SFUIDisplay-Light',
                    color: colors.theme_fg_three,
                    fontWeight: 'bold',
                  }}>
                  Complete your Order{''}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Footer>
        <Loader visible={isLoding} />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  // console.log('mapStateToProps------Cart----->', state.cart.addressText)
  return {
    isLoding: state.cart.isLoding,
    message: state.address_list.isLoding,
    status: state.address_list.isLoding,
    data: state.address_list.data,
    address: state.cart.address,
    discount: state.cart.promo_amount,
    items: state.product.cart_items,
    promo_id: state.cart.promo_id,
    special_request: state.cart.special_request,
    date: state.cart.date,

    isConfirm: state.cart.isConfirmOrder,
    cart_items: state.product.cart_items,
    sub_total: state.cart.sub_total,
    promo: state.cart.promo,
    total_amount: state.cart.total_amount,
    promo_amount: state.cart.promo_amount,
    delivery_date: state.cart.delivery_date,
    total_Kg: state.product.total_KGS,
    total_items: state.product.total_items,
    total_KGS: state.product.total_KGS,
    deleteCount: state.product.deleteCount,
    addressText: state.cart.addressText,
  };
}

const mapDispatchToProps = (dispatch) => ({
  reset: () => dispatch(reset()),
  productReset: () => dispatch(productReset()),
  orderServicePending: () => dispatch(orderServicePending()),
  orderServiceError: (error) => dispatch(orderServiceError(error)),
  orderServiceSuccess: (data) => dispatch(orderServiceSuccess(data)),
  addToCart: (data) => dispatch(addToCart(data)),
  addToCartfordelete: (data) => dispatch(addToCartfordelete(data)),
  addToCartforUndelete: (data) => dispatch(addToCartforUndelete(data)),
  totalItemsDelete: (data) => dispatch(totalItemsDelete(data)),
  totalKGsDelete: (data) => dispatch(totalKGsDelete(data)),
  addTotalItemsMinus: (data) => dispatch(addTotalItemsMinus(data)),
  listServiceActionPending: () => dispatch(listServiceActionPending()),
  listServiceActionError: (error) => dispatch(listServiceActionError(error)),
  listServiceActionSuccess: (data) => dispatch(listServiceActionSuccess(data)),
  subTotal: (data) => dispatch(subTotal(data)),
  total: (data) => dispatch(total(data)),
  calculatePricing: () => dispatch(calculatePricing()),
  selectDate: (data) => dispatch(selectDate(data)),
  specialRequest: (data) => dispatch(specialRequest(data)),
  showEditBtn: (data) => dispatch(showEditBtn(data)),
  ConfirmOrderEdit: (data) => dispatch(ConfirmOrderEdit(data)),
  selectAddress: (data) => dispatch(selectAddress(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.theme_bg_two,
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
  checkBoxStyle: {
    height: 15,
    width: 5,
  },
  itemList: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 2,
    // left:20,
    backgroundColor: '#fff',
    marginVertical: 10,
    // width:'100%',
    // backgroundColor:"#222"
  },
  title: {
    alignSelf: 'center',
    color: colors.theme_fg_two,
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qty: {
    fontSize: 15,
    color: colors.theme_fg,
    fontWeight: 'bold',
    fontFamily: 'SFUIDisplay-Medium',
  },
  promotion_applied: {
    fontSize: 15,
    color: colors.theme_fg,
    fontWeight: 'bold',
    fontFamily: 'SFUIDisplay-Medium',
  },
  choose_promotion: {
    color: colors.theme_fg,
    fontWeight: 'bold',
    fontFamily: 'SFUIDisplay-Medium',
  },
  change_promo: {
    color: colors.theme_fg,
    fontSize: 13,
    fontFamily: 'SFUIDisplay-Medium',
  },
  sub_total: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
  },
  discount: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
  },
  delievery: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  total: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  total_amount: {
    fontWeight: 'bold',
    color: colors.theme_fg_two,
  },
  delivery_date: {
    padding: 10,
    justifyContent: 'center',
  },
  delivery_date_text: {
    color: colors.theme_fg,
    marginBottom: 20,
  },
  headerBtn: {
    // backgroundColor:'#444',
    // height:50,
    width: '100%',
    flexDirection: 'row-reverse',
    // position:'absolute',
    marginTop: -7,
  },
  modalCard: {
    backgroundColor: colors.theme_bg_three,
    alignItems: 'center',
    width: '100%',
    // height: '60%',
    // top:5
    // marginTop:-10,
    // borderRadius: 50,
  },
  orderMessage: {
    alignItems: 'center',
    alignContent: 'center',
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
    backgroundColor: 'transparent',
    height: 70,
  },
  footer_content: {
    height: 70,
    width: '72%',
    justifyContent: 'center',
  },
  select_address: {
    backgroundColor: colors.theme_bg,
  },
  special_request_container: {
    // height: 90,
    width: '90%',
    marginHorizontal: 20,
    marginTop: 20,
    borderColor: colors.theme_bg,
    borderWidth: 1,
    borderRadius: 10,
    // alignContent: 'center',
    // right: 17
  },
  special_request: {
    marginLeft: 5,
    fontFamily: 'SFUIDisplay-Light',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  rowBack: {
    alignItems: 'center',
    // backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingLeft: 15,
    marginVertical: 5,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  submit: {
    width: '100%',
    height: '60%',
    marginRight: 40,
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: colors.theme_bg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  submitText: {
    bottom: 10,
    color: '#fff',
    textAlign: 'center',
  },
});
