import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {
  Container,
  Header,
  Content,
  Left,
  Body,
  Right,
  Title,
  Button,
  Icon,
  Row,
  Col,
  List,
  ListItem,
} from 'native-base';
import * as colors from '../assets/css/Colors';
import ProgressCircle from 'react-native-progress-circle';
import {Divider} from 'react-native-elements';
import Moment from 'moment';
import {washing_machine} from '../config/Constants';
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

export default class OrderDetails extends Component<Props> {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      data: this.props.navigation.getParam('data'),
      items: (typeof JSON.parse(this.props.navigation.getParam('data').items) == 'string') ? (JSON.parse(this.props.navigation.getParam('data').items)): (this.props.navigation.getParam('data').items),
      totalKg: this.props.navigation.getParam('totalKg'),
    };
  }

  handleBackButtonClick = () => {
    this.props.navigation.goBack(null);
  };

  getTotalKgs(items) {
    items = JSON.parse(items)
    let totalKgs = items && items.reduce((acc, el) => {
      if (el) {
        acc += (el.qty * el.per_unit_kg)
      }
      return acc
    }, 0)
    return totalKgs.toFixed(2)
  }




  render() {
    console.log('order detail data', this.state.data.delivery_charges);
    return (
      <Container>
        <Header androidStatusBarColor={colors.theme_bg} style={styles.header}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={this.handleBackButtonClick}>
              <Image
                source={require("../assets/arrowleft.png")}
                style={{
                  tintColor: colors.theme_fg_two,
                  height: wp("3%"),
                  width: wp("3%"),
                  resizeMode: 'contain'
                }}
              />
            </Button>
          </Left>
          <Body style={styles.header_body}>
            <Title style={styles.title}>Order Details</Title>
          </Body>
          <Right/>
        </Header>
        <Content>
          <Row>
            <Body>
              <Text style={styles.order_id}>
                Order Id - {this.state.data.order_id}
              </Text>
              <Text style={styles.created_at}>
                {Moment(this.state.data.created_at).format('DD MMM-YYYY hh:mm')}
              </Text>
            </Body>
          </Row>
          <Row style={{margin: 20}}>
            <Body>
              <ProgressCircle
                percent={this.state.data.status * 14.285}
                radius={60}
                borderWidth={3}
                color="#00aeef"
                shadowColor="#e6e6e6"
                bgColor="#FFFFFF">
                <View style={{height: 60, width: 60, alignItems: 'center'}}>
                  <Image
                    style={{flex: 1, width: '60%', height: '100%'}}
                    source={washing_machine}
                    // resizeMode='contain'
                    // source={require('../assets/json/washing-machine.svg')}
                  />
                </View>
              </ProgressCircle>
              <Text style={styles.status}>{this.state.data.label_name}</Text>
            </Body>
          </Row>
          <Divider style={styles.order_divider}/>
          <Row style={styles.row}>
            <Left>
              <Text style={styles.address_label}>Delivery Address</Text>
              <Text style={styles.address}>{this.state.data.address}</Text>
            </Left>
          </Row>
          <Row style={styles.row}>
            <Left>
              <Text style={styles.delivery_date_label}>Pickup Date</Text>
              <Text style={styles.delivery_date}>
                {(this.state.data.pickup_date.split(" ")[0])}
                
              </Text>
            </Left>
            <Body>
              <Text style={styles.delivery_date_label}>Pickup Slot</Text>
              <Text style={{
                width: '100%',
                textAlign: 'center',
                backgroundColor: colors.theme_bg,
                color: '#fff',
                paddingHorizontal: 10,
                paddingVertical: 2,
                borderRadius: 5
              }}>
                {((this.state.data.pickup_date.split(':').pop()))}
              </Text>
            </Body>
            <Right style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.delivery_date_label}>Estimated Delivery</Text>
              <Text style={styles.delivery_date}>
                {(this.state.data.expected_delivery_date.split(" ")[0])}
                  
            
              </Text>
            </Right>
          </Row>
          <View style={{marginTop: 10}}/>
          <Divider style={styles.order_divider}/>
          <Row style={styles.row}>
            <Left>
              <Text style={styles.your_cloths}>Your cloths</Text>
            </Left>
          </Row>
          <List>
            {JSON.parse(this.state.items).map((row, index) => {
              return (
                <ListItem>
                  <Row>
                    <Col style={{width: 25}}>
                      <Text style={styles.qty}>{row.qty} x</Text>
                    </Col>
                    <Col>
                      <Text>{row.product_name} ({(row.per_unit_kg * row.qty).toFixed(2)} kgs x
                        Rs. {row.service_charge})</Text>
                      <Text style={{color: '#00AEEF', fontSize: 11}}>
                        {row.service_name}
                      </Text>
                    </Col>
                    <Col style={{width: 60, alignItems: 'flex-end'}}>
                      <Text>Rs. {row.service_charge * row.qty}</Text>
                    </Col>
                  </Row>
                </ListItem>
              )
            })}
          </List>
          <Row style={styles.row}>
            <Col>
              <Text style={{fontWeight: 'bold'}}>Subtotal</Text>
            </Col>
            <Col style={{width: 60, flex: 1, alignItems: 'flex-end'}}>
              <Text>
                Rs. {this.state.data.sub_total}
              </Text>
            </Col>
          </Row>
          <Row style={styles.row}>
            <Col>
              <Text style={{fontWeight: 'bold'}}>Discount</Text>
            </Col>
            <Col style={{width: 60, flex: 1, alignItems: 'flex-end'}}>
              <Text>
                Rs. {this.state.data.discount}
              </Text>
            </Col>
          </Row>
          <Row style={styles.row}>
            <Col>
              <Text style={{fontWeight: 'bold'}}>Delivery Charges</Text>
            </Col>
            <Col style={{width: 60, flex: 1, alignItems: 'flex-end'}}>
              <Text>
                Rs. {this.state.data.delivery_charges ? this.state.data.delivery_charges : 0}
              </Text>
            </Col>
          </Row>
          <Row style={styles.row}>
            <Col>
              <Text style={{fontWeight: 'bold'}}>Extra Service (Hanger)</Text>
            </Col>
            <Col style={{width: 60, flex: 1, alignItems: 'flex-end'}}>
              <Text>
                Rs. {this.state.data.extra_service == 1 ? 300 : 0}
              </Text>
            </Col>
          </Row>
          <View style={{marginBottom: 20}}/>
          <Divider style={styles.order_divider}/>
          <Row style={styles.row}>
            <Col>
              <Text style={styles.total_label}>Total ({this.getTotalKgs(this.state.items)} kgs)</Text>
            </Col>
            <Col style={{width: 60, flex: 1, alignItems: 'flex-end'}}>
              <Text style={styles.total}>Rs. {this.state.data.total}</Text>
            </Col>
          </Row>
          <Divider style={styles.order_divider}/>
          <Row style={styles.row}>
            <Col>
              <Text style={styles.total}>Payment Method</Text>
            </Col>
            <Col style={{alignItems: 'flex-end'}}>
              <Text style={styles.total_label}>Cash On Delivery</Text>
            </Col>
          </Row>
        </Content>
      </Container>
    );
  }
}

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
  order_id: {
    marginTop: 10,
    fontSize: 15,
    color: colors.theme_fg_two,
    fontWeight: 'bold',
  },
  created_at: {
    marginTop: 5,
    fontSize: 12,
  },
  status: {
    marginTop: 10,
    fontSize: 13,
    color: colors.theme_fg,
    fontWeight: 'bold',
  },
  order_divider: {
    backgroundColor: colors.theme_fg_two,
    width: '90%',
    alignSelf: 'center',
  },
  row: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  address_label: {
    marginTop: 10,
    fontSize: 13,
    color: colors.theme_fg_two,
    fontWeight: 'bold',
  },
  address: {
    marginTop: 5,
    fontSize: 13,
  },
  delivery_date_label: {
    marginTop: 10,
    
    fontSize: 13,
    color: colors.theme_fg_two,
    fontWeight: 'bold',
    textAlign: 'center',
    minHeight: 35
  },
  delivery_date: {
    marginTop: 5,
    fontSize: 13,
    color: colors.theme_bg,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  your_cloths: {
    marginTop: 10,
    fontSize: 13,
    color: colors.theme_fg_two,
    fontWeight: 'bold',
  },
  qty: {
    fontSize: 15,
    color: colors.theme_fg,
    fontWeight: 'bold',
  },
  total_label: {
    fontWeight: 'bold',
    color: colors.theme_bg,
  },
  total: {
    color: colors.theme_fg_two,
  },
});
