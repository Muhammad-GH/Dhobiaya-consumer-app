import React, {Component} from 'react';
import {StatusBar, TouchableOpacity, View, Image, Alert} from 'react-native';
import {
  Container,
  Spinner,
  Content,
  Form,
  Item,
  Input,
  Button,
  Text,
} from 'native-base';
import {
  Icon,
  H2,
  Tab,
  Tabs,
  Header,
  Title,
  Left,
  Right,
  Body,
} from 'native-base';
import * as colors from '../assets/css/Colors';
import Login from './Login1';
import SignUp from './Signup';

class LoginSignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPage: this.props.navigation.getParam('activetab'),
      activeTab: this.props.navigation.getParam('activetab'),
    };
  }
  handler = () => {
    this.setState({
      // initialPage:1,
      activeTab: 1,
    });
  };
  render() {
    return (
      <Container>
        <Content>
          <View style={{backgroundColor: '#fafafa'}}>
            {/* <Image source={{ uri: this.state.user_picture }}
             style={{ borderWidth:1, borderColor:'#000', alignSelf: 'center', height: 130, width: 130, borderRadius: 63, top: 20 }}/> */}
            <View style={{alignItems: 'center', top: 10, padding: 20}}>
              <Image
                source={require('../assets/login_signup.png')}
                style={{width: '100%', height: 200}}
                resizeMode="cover"
              />
            </View>
            <Tabs
              style={{top: 20}}
              initialPage={this.state.initialPage}
              page={this.state.activeTab}
              // tabBarBackgroundColor="#111"
              // tabContainerStyle={{ width: '100%' }}
              tabBarUnderlineStyle={{backgroundColor: colors.theme_fgL}}
              // tabBarInactiveTextColor
            >
              <Tab
                tabContainerStyle={{flex: 1}}
                tabBarUnderlineStyle={{backgroundColor: colors.theme_bg}}
                textStyle={{color: colors.theme_fgL}}
                heading={'LOGIN'}
                tabStyle={{
                  backgroundColor: colors.theme_bg_three,
                  color: '#111',
                }}
                activeTabStyle={{backgroundColor: colors.theme_bg_three}}
                activeTextStyle={{
                  color: colors.theme_bg,
                  fontWeight: 'bold',
                  tabBarUnderlineStyle: '#111',
                }}>
                <Login
                  navigation={this.props.navigation}
                  handler={this.handler}
                />
              </Tab>

              <Tab
                heading={'SIGN UP'}
                tabContainerStyle={{height: '100%'}}
                tabStyle={{backgroundColor: colors.theme_bg_three}}
                textStyle={{color: colors.theme_fgL}}
                activeTabStyle={{
                  backgroundColor: colors.theme_bg_three,
                  color: colors.theme_fgL,
                }}
                activeTextStyle={{
                  color: colors.theme_bg,
                  fontWeight: 'bold',
                }}>
                <SignUp navigation={this.props.navigation} />
              </Tab>
            </Tabs>
          </View>
        </Content>
      </Container>
    );
  }
}

export default LoginSignUp;
