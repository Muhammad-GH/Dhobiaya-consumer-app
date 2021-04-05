import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  Image,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Title,
  Col,
  Item,
  Input,
  Icon,
  Button,
} from 'native-base';
import {
  api_url,
  my_orders,
  height_30,
  no_data,
  washing_machine,
} from '../config/Constants';
import * as colors from '../assets/css/Colors';
import {Loader} from '../components/GeneralComponents';
import Moment from 'moment';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
} from '../actions/MyOrdersActions';
import ProgressCircle from 'react-native-progress-circle';
import ResponsiveText from '../components/ResponsiveText';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

class MyOrders extends Component<Props> {
  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
      refresh: false,
      toggleOrders: true,
      page: 1,
    };
  }

  async componentDidFocus() {
    this.my_orders(this.state.page);
  }

  componentWillUnmount() {
    this.subs.forEach((sub) => sub.remove());
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
  myorders_details = (data) => {
    this.props.navigation.navigate('OrderDetails', {data: data});
  };

  my_orders = async ({page}) => {
    this.props.serviceActionPending();
    await axios({
      method: 'post',
      url: api_url + my_orders,
      data: {page: page, customer_id: global.id},
    })
      .then((response) => {
        this.props.serviceActionSuccess(response.data);
      })
      .catch((error) => {
        this.props.serviceActionError(error);
      });
  };

  onRefresh = () => {
    if (true) {
      setTimeout(() => {
        this.my_orders(this.state.page);
      }, 10);
    }
    this.setState({refresh: false});
  };
  handleBackButtonClick = () => {
    this.props.navigation.goBack(null);
  };

  serachFunc = () => {
    alert('hi');
  };

  getTotalKgs(items) {
    items1 =
      typeof JSON.parse(items) == 'string'
        ? JSON.parse(JSON.parse(items))
        : JSON.parse(items);
    let totalKgs =
      items1 &&
      items1.reduce((acc, el) => {
        if (el) {
          acc += el.qty * el.per_unit_kg;
        }
        return acc;
      }, 0);
    return totalKgs.toFixed(2);
  }

  renderItem = (row) => {
    return (
      <React.Fragment>
        <ListItem
          onPress={() => this.myorders_details(row)}
          style={{
            borderBottomWidth: row.status > 6 ? 1 : 0.5,
            borderBottomColor: row.status > 6 ? '#05a493' : '#a4a9b7',
          }}>
          <Col style={{width: '30%'}}>
            <ProgressCircle
              percent={row.status * 14.285}
              radius={30}
              borderWidth={3}
              color="#00aeef"
              shadowColor="#e6e6e6"
              bgColor="#FFFFFF">
              <View style={{height: 30, width: 30}}>
                <Image
                  style={{
                    flex: 1,
                    width: undefined,
                    height: undefined,
                  }}
                  source={washing_machine}
                  resizeMode="contain"
                />
              </View>
            </ProgressCircle>
          </Col>
          <Col>
            <Text style={styles.order_id}>Order Id : {row.order_id}</Text>
            <View style={{margin: 1}} />
            <Text style={{fontSize: 10}}>
              {Moment(row.created_at).format('DD MMM-YYYY hh:mm')}
            </Text>
            <Text style={{color: colors.theme_fg}}>{row.label_name}</Text>
          </Col>
          <Col style={{alignItems: 'flex-end'}}>
            <Text style={styles.total}>
              Kgs{' '}
              <Text
                style={{
                  fontWeight: 'bold',
                }}>
                {this.getTotalKgs(row.items)}
              </Text>
            </Text>
            <Text style={styles.total}>
              Rs.{' '}
              <Text
                style={{
                  fontWeight: 'bold',
                }}>
                {row.total}
              </Text>
            </Text>
          </Col>
        </ListItem>
      </React.Fragment>
    );
  };

  onEndReached = ({distanceFromEnd}) => {
    if (!this.onEndReachedCalledDuringMomentum) {
      // this.fetchData();
      console.log('object');
      this.onEndReachedCalledDuringMomentum = true;
    }
  };

  handleLoadMore = async () => {
    // this.setState({page : this.state.page +1})

    // her you put the logic to load some data with pagination
    // for example a service who return the data of the page "this.state.currentPage"
    // let newData1 = this.my_orders(this.state.page);
    console.log('this.state.page');
    // this.setState({ mockData: [ ...mockData , ...newData] })
  };

  render() {
    Moment.locale('en');
    const {isLoding, error, data, message, status} = this.props;
    let newData = [];
    let completeData = [];
    let progressData = [];
    if (Array.isArray(data)) {
      data.map((val) => {
        if (val.status > 6) {
          completeData.push(val);
        } else {
          progressData.push(val);
        }
      });
    }
    newData = progressData.concat(completeData);
    let activeOrderNumber = 0;
    let pastOrderNumber = 0;
    if (newData && newData.length > 0) {
      newData.forEach((item) => {
        if (item.status <= 6) {
          activeOrderNumber += 1;
        } else {
          pastOrderNumber += 1;
        }
      });
    }
    const {toggleOrders} = this.state;
    return (
      <Container>
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
            <Title style={styles.title}>Orders</Title>
          </Body>
          <Right />
        </Header>

        <Content
          refreshControl={
            <RefreshControl
              refreshing={this.state.refresh}
              onRefresh={this.onRefresh}
            />
          }>
          <Loader visible={isLoding} />
          <View style={styles.orderToggleContainer}>
            <TouchableOpacity
              onPress={() => this.setState({toggleOrders: true})}
              style={{
                ...styles.toggleView,
                backgroundColor: toggleOrders ? '#02AEF0' : '#56D5FE',
              }}>
              <ResponsiveText style={{...styles.toggleText}}>
                Active Orders ({activeOrderNumber})
              </ResponsiveText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({toggleOrders: false})}
              style={{
                ...styles.toggleView,
                backgroundColor: toggleOrders ? '#56D5FE' : '#02AEF0',
              }}>
              <ResponsiveText style={styles.toggleText}>
                Past Order ({pastOrderNumber})
              </ResponsiveText>
            </TouchableOpacity>
          </View>
            <FlatList
              data={newData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => this.renderItem(item)}
              initialNumToRender={8} // how many item to display first
              onEndReachedThreshold={0.5} // so when you are at 5 pixel from the bottom react run onEndReached function
              onEndReached={this.onEndReached.bind(this)}
              onMomentumScrollBegin={() => {
                this.onEndReachedCalledDuringMomentum = false;
              }}
            />
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoding: state.myorders.isLoding,
    error: state.myorders.error,
    data: state.myorders.data.data,
    message: state.myorders.message,
    status: state.myorders.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
  serviceActionPending: () => dispatch(serviceActionPending()),
  serviceActionError: (error) => dispatch(serviceActionError(error)),
  serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.theme_bg,
  },
  icon: {
    color: colors.theme_fg_three,
  },
  header_body: {
    flex: 3,
    justifyContent: 'center',
  },
  title: {
    alignSelf: 'center',
    color: colors.theme_fg_three,
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderToggleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 20,
    marginVertical: 10,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  toggleView: {
    paddingVertical: 10,
    width: '35%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    color: '#fff',
    fontSize: 3.5,
  },

  order_id: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.theme_fg_two,
  },
  total: {
    fontSize: 15,
    color: colors.theme_fg_two,
  },
});
