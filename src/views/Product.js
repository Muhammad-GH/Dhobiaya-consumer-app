import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
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
import UIStepper from 'react-native-ui-stepper';
import {
  img_url,
  api_url,
  product,
  height_30,
  no_data,
  minus,
  service,
} from '../config/Constants';
import {Loader} from '../components/GeneralComponents';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
  addToCart,
  addTotalItemsPlus,
  addTotalItemsMinus,
  addTotalKg,
  service_id,
  getTotalItemAndKgs,
} from '../actions/ProductActions';
import {
  serviceActionPending as homePending,
  serviceActionError as homeError,
  serviceActionSuccess as homeSuccess,
} from '../actions/HomeActions';
import {subTotal} from '../actions/CartActions';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Menu, {MenuDivider, MenuItem} from 'react-native-material-menu';
import CounterComponent from "../components/CounterComponent";
import {theme_bg} from "../assets/css/Colors";

class Product extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      category_ID: 1,
      service_ID: this.props.dataHome[0].id,
      service_name: this.props.dataHome[0].service_name,
      activeIndex: 0,
      total_items: this.props.total_items,
      total_kgs: '',
      hideTab: false,

      myCart: {},
      productList: []
    };
  }

  async componentDidFocus() {
    this.props.getTotalItemAndKgs();
  }

  componentWillUnmount() {
    this.subs.forEach((sub) => sub.remove());
  }

  componentWillUpdate() {
    // this.subs.forEach(sub => sub.remove());
  }

  async componentDidMount() {
    this.props.navigation.setParams({tabBarVisible: true});
    this.subs = [
      this.props.navigation.addListener('didFocus', (payload) =>
        this.componentDidFocus(payload),
      ),
    ];
  }

  static navigationOptions = ({navigation}) => {
    return {
      tabBarVisible:
        navigation.state.params && navigation.state.params.tabBarVisible,
    };
  };

  
  Product_id = async (id, service_name) => {
    this.setState({service_ID: id, service_name: service_name});
    await this.props.serviceActionPending();
    await axios({
      method: 'post',
      url: api_url + product,
      data: {service_id: id},
    })
      .then(async (response) => {
        if (this.refs.Categories) {
          this.refs.Categories.scrollTo({x: 0, y: 0, animated: true})
        }
        if (response.data.result.length > 0) {
          this.setState({
            category_ID: response.data.result[0].id,
          }, async () => {
            await this.props.serviceActionSuccess(response.data);
          })
        }
      })
      .catch((error) => {
        this.props.serviceActionError(error);
      });
  };
  handleBackButtonClick = () => {
    this.props.navigation.goBack(null);
  };

  add_to_cart = async (qty, product_id, product_name, price, per_unit_kg) => {
    let cart_items = this.props.cart_items;
  };

  onIncrement = async (qty, product_id, product_name, price, per_unit_kg, service_charge) => {
    let {
      category_ID,
      service_ID,
      myCart,
      service_name
    } = this.state;
    let key = `${service_ID}-${category_ID}-${product_id}`
    if (key in myCart) {
      myCart[key].qty = myCart[key].qty + 1
      myCart[key].price = parseFloat((myCart[key].qty) * price)
    } else {
      myCart[key] = {
        service_id: service_ID,
        service_name: service_name,
        product_id: product_id,
        product_name: product_name,
        per_unit_kg: per_unit_kg,
        service_type: category_ID,
        service_charge: service_charge,
        qty: qty + 1,
        price: parseFloat((qty + 1) * price),
      };
    }
    this.setState({myCart})
  };

  onDecrement = async (qty, product_id, product_name, price, per_unit_kg, service_charge) => {
    let {
      category_ID,
      service_ID,
      myCart,
    } = this.state;
    let key = `${service_ID}-${category_ID}-${product_id}`
    if (key in myCart && myCart[key].qty > 0) {
      myCart[key].qty = myCart[key].qty - 1
      myCart[key].price = parseFloat((myCart[key].qty) * price)
    }
    if (key in myCart && myCart[key].qty === 0) {
      delete myCart[key]
    }
    this.setState({myCart})
  };

  totalCount = async () => {
    const totalKgs = parseFloat(total + total_2).toFixed(2);
    this.props.addTotalKg(totalKgs);
  };

  cart = () => {
    let {
      myCart,
    } = this.state;
    this.props.navigation.navigate('Cart', {myCart, clearCart: this.clearCart.bind(this)});
  };

  clearCart() {
    this.setState({myCart: {}})
  }

  renderServices = (item, index) => {
    const {cart_items, total_items} = this.props;
    let {
      category_ID,
      service_ID,
      myCart,
    } = this.state;
    let key = `${service_ID}-${category_ID}-${item.item.id}`
    return (
      <ListItem>
        <Row
          style={{
            padding: 7,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Col style={styles.list_item}>
            <View>
              <Image
                style={{flex: 1, width: hp('50%'), height: hp('70%')}}
                source={{uri: img_url + item.item.image}}
                resizeMode="contain"
              />
            </View>
          </Col>

          <Col style={styles.list_item_image}>
            <Text style={styles.product_name}>{item.item.product_name}</Text>
          </Col>

          <Col style={{...styles.list_item_image}}>
            <CounterComponent
              value={myCart[key] ? myCart[key].qty : 0}
              onIncrement={(value) => {
                this.onIncrement(
                  value,
                  item.item.id,
                  item.item.product_name,
                  item.item.price,
                  item.item.per_unit_kg,
                  item.item.service_charge,
                )
              }}
              onDecrement={(value) => {
                this.onDecrement(
                  value,
                  item.item.id,
                  item.item.product_name,
                  item.item.price,
                  item.item.per_unit_kg,
                  item.item.service_charge,
                );
              }
              }
            />

          </Col>
        </Row>
      </ListItem>
    );
  };

  category = (data) => {
    this.setState({
      category_ID: data,
    });
  };

  addcategory = () => {
    if (this.state.category_ID === 4) {
      return false;
    } else {
      this.setState({category_ID: this.state.category_ID + 1});
    }
  };

  backcategory = () => {
    if (this.state.category_ID === 1) {
      return false;
    } else {
      this.setState({category_ID: this.state.category_ID - 1});
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    const {myCart} = this.state;
    if (Object.keys(myCart).length > 0) {
      if (this.state.hideTab) {
        this.setState(
          {
            hideTab: false,
          },
          () => {
            this.props.navigation.setParams({tabBarVisible: false});
          },
        );
      }
    } else if (Object.keys(myCart).length === 0) {
      if (!this.state.hideTab) {
        this.setState(
          {
            hideTab: true,
          },
          () => {
            this.props.navigation.setParams({tabBarVisible: true});
          },
        );
      }

      return true;
    }
    return true;
  }

  setMenuRef = (ref) => {
    this._menu = ref;
  };
  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };


  render() {
    const {
      isLoding,
      data,
      dataHome,
      total_items,
    } = this.props;
    const {myCart} = this.state;
    let totalItems = 0;
    let totalKgs = 0;
    totalItems = Object.values(myCart).reduce((acc, el) => {
      if (el) {
        acc += el.qty
        return acc
      }
    }, 0)
    // per_unit_kg
    totalKgs = Object.values(myCart).reduce((acc, el) => {
      if (el) {
        acc += el.qty * el.per_unit_kg
        return acc
      }
    }, 0)
    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header}>
          <Left style={{flex: 1}}>
            <View style={{width: '30%'}}/>
          </Left>
          <Body style={styles.header_body}>
            <Title style={styles.title}>{this.state.service_ID===1 ? 'Complete Laundry' : this.state.service_name}</Title>
          </Body>
          <Right>
            {Object.keys(myCart).length > 0 ? (
              <View>
                <Icon
                  ref={this.setMenuRef}
                  onPress={this.showMenu}
                  style={{fontSize: 23, color: 'white'}}
                  color={'white'}
                  name="dots-three-vertical"
                  type="Entypo"
                />
                <Menu ref={this.setMenuRef}>
                  <MenuItem
                    textStyle={{fontSize: 14}}
                    onPress={() => {
                      this.hideMenu();
                      this.props.navigation.navigate('Dashboard');
                    }}>
                    Home
                  </MenuItem>
                  <MenuDivider/>
                  <MenuItem
                    textStyle={{fontSize: 14}}
                    onPress={() => {
                      this.hideMenu();

                      this.props.navigation.navigate('MyOrders');
                    }}>
                    My Order
                  </MenuItem>
                  <MenuDivider/>
                  <MenuItem
                    textStyle={{fontSize: 14}}
                    onPress={() => {
                      this.hideMenu();

                      this.props.navigation.navigate('Profile');
                    }}>
                    Profile
                  </MenuItem>
                  <MenuDivider/>
                  <MenuItem
                    textStyle={{fontSize: 14}}
                    onPress={() => {
                      this.hideMenu();

                      this.props.navigation.navigate('More');
                    }}>
                    More
                  </MenuItem>
                </Menu>
              </View>
            ) : null}
          </Right>
        </Header>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: 5,
          }}>
          <TouchableOpacity onPress={() => {
            if (this.refs.ScrollViewRefs) {
              this.refs.ScrollViewRefs.scrollTo({x: 0, y: 0, animated: true})
            }
          }}>
            <Image
              source={require('../assets/arrowleft.png')}
              style={{height: 15, width: 15, resizeMode: 'contain', tintColor: theme_bg}}
            />
          </TouchableOpacity>
          <ScrollView
            ref={"ScrollViewRefs"}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{flexGrow: 0.0}}
          >
            {
              dataHome.map((row) => {
                let service_image = img_url + row.image;
                return (
                  <TouchableOpacity
                    activeOpacity={true ? 0.7 : 0.3}
                    style={[
                      styles.imageSlide,
                      {
                        backgroundColor:
                          this.state.service_ID === row.id
                            ? colors.theme_bg
                            : colors.theme_bg_three,
                      },
                    ]}
                    onPress={() => {
                      this.Product_id(row.id, row.service_name);
                    }}>
                    <Image
                      source={{uri: service_image}}
                      style={{
                        tintColor:
                          this.state.service_ID === row.id ? 'white' : colors.theme_bg,
                        flex: 1,
                        height: null,
                        width: null,
                      }}
                      resizeMode="contain"
                    />
                    <Text
                      style={[
                        styles.textSlide,
                        {
                          color:
                            this.state.service_ID === row.id
                              ? '#f9fbff'
                              : colors.theme_bg,
                          fontFamily: 'SFUIDisplay-Medium',

                        },
                      ]}>
                      {row.service_name}
                    </Text>
                  </TouchableOpacity>
                );
              })
            }
          </ScrollView>
          <TouchableOpacity onPress={() => {
            if (this.refs.ScrollViewRefs) {
              this.refs.ScrollViewRefs.scrollToEnd({animated: true})
            }
          }}>
            <Image
              source={require('../assets/arrowright.png')}
              style={{height: 15, width: 15, resizeMode: 'contain', tintColor: theme_bg}}
            />
          </TouchableOpacity>
        </View>

        <Body style={{marginTop: 5, backgroundColor: '#f9fbff', width: '100%'}}>
          <View
            style={{
              // flex: 1,
              height: 50,
              flexDirection: 'row',
              width: '100%',
            }}>
            <View
              style={{
                height: 50,
                backgroundColor: colors.theme_bg,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <View style={{}}>
                <TouchableOpacity onPress={this.backcategory}>
                  <Image
                    source={require('../assets/arrowleft.png')}
                    style={{height: 15, width: 15, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
              </View>
              <ScrollView
                ref={"Categories"}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {data && data.length > 0
                  ? data.map((row, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={true ? 0.7 : 0.3}
                        style={{
                          width: wp(30),
                          height: 50,
                          borderBottomWidth:
                            this.state.category_ID === row.id ? 3 : 0,
                          borderBottomColor:
                            this.state.category_ID === row.id
                              ? '#ffff'
                              : '#00aeef',

                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          this.category(row.id);
                        }}>
                        <Text
                          style={{
                            fontFamily: 'SFUIDisplay-Medium',

                            color:
                              this.state.category_ID === row.id
                                ? '#FFF'
                                : '#55CCF9',
                            fontSize: 15,
                          }}>
                          {row.category_name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                  : null}
              </ScrollView>

              <View style={{}}>
                <TouchableOpacity onPress={this.addcategory}>
                  <Image
                    source={require('../assets/arrowright.png')}
                    style={{height: 15, width: 15, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 10,
              width: '100%',
              flexDirection: 'row',
              marginTop: 7,
            }}>
            <View
              style={{
                backgroundColor:
                  this.state.category_ID === 1 ? '#666' : '#f2ebeb',
                borderRadius: 50,
                height: 10,
                width: 10,
              }}
            />
            <View
              style={{
                backgroundColor:
                  this.state.category_ID === 2
                    ? '#666'
                    : this.state.category_ID === 3
                    ? '#666'
                    : '#d1c9c9',
                borderRadius: 50,
                height: 10,
                width: 10,
                marginHorizontal: 10,
              }}
            />
            <View
              style={{
                backgroundColor:
                  this.state.category_ID === 4 ? '#666' : '#d1c9c9',
                borderRadius: 50,
                height: 10,
                width: 10,
              }}
            />
          </View>

          <View style={{width: '100%'}}>
            <ScrollView>
              <List style={{marginBottom: 50}}>
                {data && data.length > 0
                  ? data.map((data, index) => {
                    if (data.id === this.state.category_ID) {
                      return (
                        <FlatList
                          data={data.product}
                          renderItem={this.renderServices}
                          keyExtractor={
                            (item, index) => index.toString()
                          }
                        />
                      );
                    }
                  })
                  : null}
              </List>
            </ScrollView>
          </View>
        </Body>
        {Object.keys(myCart).length === 0 ? null : (
          <Footer style={styles.footer}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this.cart()}
              style={styles.footer_container}>
              <Row>
                <Col style={styles.view_cart_container}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.view_cart, {
                      fontSize: 14, fontFamily: 'SFUIDisplay-Medium',
                    }]}>
                      Total Items:{' '}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: colors.theme_fg_three,
                        fontFamily: 'SFUIDisplay-Bold',
                        marginTop: 1,
                      }}>
                      {totalItems}
                    </Text>
                  </View>
                </Col>
                <Col style={styles.view_cart_container}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.view_cart, {
                      fontSize: 14, fontFamily: 'SFUIDisplay-Medium',
                    }]}>
                      Kgs:{' '}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: colors.theme_fg_three,
                        fontFamily: 'SFUIDisplay-Bold',
                        marginTop: 2,
                      }}>
                      {totalKgs.toFixed(2)}
                    </Text>
                  </View>
                </Col>
                <Col style={styles.view_cart_container}>
                  <View style={{width: 50}}>
                    <Image
                      source={require('../assets/add_card.png')}
                      style={styles.addCardIcon}
                    />
                    <View style={styles.cardCountInfo}>
                      <Text style={{
                        fontSize: 7, textAlign: 'center', fontFamily: 'SFUIDisplay-Medium',
                      }}>
                        {' '}
                        {totalItems}
                      </Text>
                    </View>
                  </View>
                </Col>
              </Row>
            </TouchableOpacity>
          </Footer>
        )}
        <Loader visible={isLoding}/>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.product.isLoding,
    error: state.product.error,
    dataHome: state.home.data,
    data: state.product.data,
    message: state.product.message,
    status: state.product.status,
    cart_items: state.product.cart_items,
    cart_count: state.product.cart_count,
    sub_total: state.cart.sub_total,
    total_items: state.product.total_items,
    total_KGS: state.product.total_KGS,
  };
}

const mapDispatchToProps = (dispatch) => ({
  serviceActionPending: () => dispatch(serviceActionPending()),
  serviceActionError: (error) => dispatch(serviceActionError(error)),
  serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data)),
  addToCart: (data) => dispatch(addToCart(data)),
  addTotalItemsPlus: (data) => dispatch(addTotalItemsPlus(data)),
  addTotalItemsMinus: (data) => dispatch(addTotalItemsMinus(data)),
  addTotalKg: (data) => dispatch(addTotalKg(data)),
  subTotal: (data) => dispatch(subTotal(data)),
  getTotalItemAndKgs: (data) => dispatch(getTotalItemAndKgs()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Product);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.theme_bg_two,
  },
  header: {
    backgroundColor: colors.theme_bg,
  },
  icon: {
    color: colors.theme_bg_three,
  },
  imageSlide: {
    height: hp(12),
    width: wp(30),
    margin: 5,
    justifyContent: 'center',
    borderRadius: 3,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    paddingVertical: 5,
  },
  textSlide: {
    fontSize: 12,
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'center',
    padding: 2,
  },
  slideDotted: {},
  header_body: {
    flex: 3,
    justifyContent: 'center',
  },
  list_item: {
    height: 100,
    width: 90,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  list_item_image: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  title: {
    color: colors.theme_bg_three,
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  background_image: {
    width: '50%',
    height: '50%',
  },
  touchable_opacity: {
    backgroundColor: colors.black_layer,
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  service_name: {
    color: colors.theme_bg_three,
    fontSize: 18,
    fontWeight: 'bold',
  },
  image_container: {
    height: 100,
    width: 90,
  },
  product_name: {
    fontSize: 15,
    fontFamily: 'SFUIDisplay-Medium',
    color: colors.theme_fg_two,
    paddingLeft: 5,
  },
  price: {
    fontSize: 15,
    color: colors.theme_fg,
  },
  piece: {
    fontSize: 12,
    color: colors.theme_fg,
  },
  footer: {
    backgroundColor: 'transparent',
  },
  footer_container: {
    width: '100%',
    backgroundColor: colors.theme_bg,
  },
  view_cart_container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  view_cart: {
    color: colors.theme_fg_three,
  },
  addCardIcon: {
    width: 30,
    height: 30,
  },
  cardCountInfo: {
    position: 'absolute',
    backgroundColor: '#ffff',
    borderRadius: 20,
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    top: -5,
    right: 8,
  },
});
