import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text} from 'react-native';
import {
  Container,
  Header,
  Content,
  Left,
  Body,
  Right,
  Title,
  Button as Btn,
  Icon,
  Footer,
} from 'native-base';
import {api_url, place_order} from '../config/Constants';
import {NavigationActions} from 'react-navigation';
import * as colors from '../assets/css/Colors';
import {Loader} from '../components/GeneralComponents';
import {Button} from 'react-native-elements';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  orderServicePending,
  orderServiceError,
  orderServiceSuccess,
} from '../actions/PaymentActions';
import {reset} from '../actions/CartActions';
import {productReset} from '../actions/ProductActions';
import RadioForm from 'react-native-simple-radio-button';
import Modal from 'react-native-modal';

var radio_props = [{label: 'Cash', value: 1}];

class Payment extends Component<Props> {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.select_payment_method = this.select_payment_method.bind(this);
    this.state = {
      payment_mode: 1,
      isModalOpen: false,
    };
  }

  handleBackButtonClick = () => {
    this.props.navigation.goBack(null);
  };

  place_order = async () => {
    this.setState({isModalOpen: true});
    // this.props.orderServicePending();
    // await axios({
    //   method: 'post',
    //   url: api_url + place_order,
    //   data:{
    // special_requests:this.props.special_request,
    // customer_id: global.id,
    // payment_mode: this.state.payment_mode,
    // address_id:this.props.address,
    // expected_delivery_date:this.props.delivery_date,
    // total:this.props.total,
    // discount:this.props.discount,
    // sub_total:this.props.sub_total,
    // promo_id:this.props.promo_id,
    // items: JSON.stringify(Object.values(this.props.items))
    //   }
    // })
    // .then(async response => {
    //   await this.props.orderServiceSuccess(response.data);
    //   await this.move_orders();
    // })
    // .catch(error => {
    //   this.props.orderServiceError(error);
    // });
  };

  async move_orders() {
    await this.props.reset();
    await this.props.productReset();
    const navigateAction = NavigationActions.navigate({
      routeName: 'MyOrders',
    });
    this.props.navigation.dispatch(navigateAction);
  }

  select_payment_method() {
    //select your payment
  }

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

  render() {
    const {isLoding, error, data, message, status} = this.props;

    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header}>
          <Left style={{flex: 1}}>
            <Btn onPress={this.handleBackButtonClick} transparent>
              <Icon style={styles.icon} name="arrow-back" />
            </Btn>
          </Left>
          <Body style={styles.heading}>
            {/* <Title style={styles.title} >Payment Mode</Title> */}
            <Title style={styles.title}>Place Order</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{padding: 20}}>
          {/* <RadioForm
            radio_props={radio_props}
            initial={0}
            animation={true}
            onPress={this.select_payment_method}
            labelStyle={styles.radio_style}
          /> */}
          <Modal
            visible={this.state.isModalOpen}
            onSwipe={this.goToHome}
            swipeDirection="right"
            swipeDirection="left"
            animationType="fade"
            // coverScreen="false"
            // propagateSwipe="false"
            backdropOpacity={0.8}
            animationIn="slideInUp"
            transparent={true}
            backdropColor="#666"
            // backdropTransitionOutTiming="300"

            // animationType='none'
            // style={{backgroundColor:'#777'}}
          >
            <View style={styles.modalCard}>
              <TouchableOpacity
                style={{marginTop: 10, marginLeft: 260}}
                onPress={this.goToHome}>
                <Icon type="AntDesign" name="closecircleo" />
              </TouchableOpacity>
              <Image
                source={require('../assets/logo02.png')}
                style={{width: '40%', height: '40%', marginVertical: 5}}
                resizeMode="contain"
              />
              <View style={styles.orderMessage}>
                <Text style={{textAlign: 'center'}}>
                  Your order has been successfully added
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={this.goToOrder}
                  style={styles.gotoOrderBtn}>
                  <Text style={{color: colors.theme_bg_three}}>
                    Go To My Orders
                  </Text>
                </TouchableOpacity>
                <View
                  style={{alignItems: 'center', marginTop: 20}}
                  onPress={() => {
                    this.setState({isModalOpen: false});
                  }}>
                  <Icon
                    type="Entypo"
                    name="check"
                    style={{
                      backgroundColor: colors.promo_color,
                      color: 'white',
                      borderRadius: 50,
                      width: 30,
                      height: 30,
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </Content>
        <Footer style={styles.footer}>
          <View style={styles.footer_content}>
            <Button
              onPress={this.place_order}
              // title="Place Order"
              title="Confirm Order"
              buttonStyle={styles.place_order}
            />
          </View>
        </Footer>
        <Loader visible={isLoding} />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.payment.isLoding,
    error: state.payment.error,
    data: state.payment.data,
    message: state.payment.message,
    status: state.payment.status,
    address: state.cart.address,
    delivery_date: state.cart.delivery_date,
    total: state.cart.total_amount,
    sub_total: state.cart.sub_total,
    discount: state.cart.promo_amount,
    promo_id: state.cart.promo_id,
    items: state.product.cart_items,
    special_request: state.cart.special_request,
  };
}

const mapDispatchToProps = (dispatch) => ({
  orderServicePending: () => dispatch(orderServicePending()),
  orderServiceError: (error) => dispatch(orderServiceError(error)),
  orderServiceSuccess: (data) => dispatch(orderServiceSuccess(data)),
  reset: () => dispatch(reset()),
  productReset: () => dispatch(productReset()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);

const styles = StyleSheet.create({
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
  radio_style: {
    marginLeft: 20,
    fontSize: 17,
    color: colors.theme_bg,
    fontWeight: 'bold',
  },
  modalCard: {
    backgroundColor: colors.theme_bg_three,
    alignItems: 'center',
    width: '100%',
    height: '60%',
    borderRadius: 15,
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
  },
  footer_content: {
    width: '90%',
  },
  place_order: {
    backgroundColor: colors.theme_bg,
  },
});
