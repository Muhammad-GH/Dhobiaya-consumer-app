import {Dimensions} from 'react-native';

export const base_url = 'http://app.staging-gridshub.site/';
export const api_url = 'http://app.staging-gridshub.site/api/';
export const settings = 'app_setting';
export const img_url = 'http://app.staging-gridshub.site/uploads/';
export const service = 'service';
export const faq = 'faq';
export const privacy = 'privacy_policy';
export const product = 'product';
export const register = 'customer';
export const login = 'customer/login';
export const address = 'address';
export const address_list = 'address/all';
export const address_delete = 'address/delete';
export const my_orders = 'get_orders';
export const promo_code = 'promo';
export const profile = 'customer';
export const profile_picture = 'customer/profile_picture';
export const forgot = 'customer/forgot_password';
export const reset = 'customer/reset_password';
export const place_order = 'order';

export const no_data = 'Sorry no data found...';
//Size
export const screenHeight = Math.round(Dimensions.get('window').height);
export const height_40 = Math.round((40 / 100) * screenHeight);
export const height_50 = Math.round((50 / 100) * screenHeight);
export const height_60 = Math.round((60 / 100) * screenHeight);
export const height_35 = Math.round((30 / 100) * screenHeight);
export const height_20 = Math.round((20 / 100) * screenHeight);
export const height_30 = Math.round((30 / 100) * screenHeight);

//Path
export const logo1 = require('.././assets/json/dhobiaya.svg');
export const logo = require('.././assets/logo.png');
export const logo12 = require('.././assets/logo02.png');
export const logo2 = require('.././assets/logo_with_name.png');
export const forgot_password = require('.././assets/forgot_password.png');
export const forgot_pass = require('.././assets/forgot.png');
export const reset_password = require('.././assets/reset.png');
export const loading = require('.././assets/loading.png');
export const pin = require('.././assets/location_pin.png');
export const login_image = require('.././assets/logo_with_name.png');
export const washing_machine1 = require('.././assets/json/washing-machine.svg');
export const washing_machine = require('.././assets/washing_machine01.png');
export const washing_machine12 = require('.././assets/washing_machine.png');
export const minus = require('.././assets/minus.png');
export const default_img = require('.././assets/default_img.png');
export const edite_icon = require('.././assets/edite_icon.png');
export const check_icon = require('.././assets/check.png');
export const delete_icon = require('.././assets/delete.png');
export const tick_mark = require('.././assets/tick_mark.png');
//Map
export const GOOGLE_KEY = 'AIzaSyC55HJG3esLqStJ2AcGkA-lYWgOzg4A3uM';
export const LATITUDE_DELTA = 0.015;
export const LONGITUDE_DELTA = 0.0152;

//Login Keys
export const WEB_CLIENT_ID = '952207352325-l8f0od4m59i0e2bfa3tno3mvjplecuml.apps.googleusercontent.com';

//More Menu
export const menus = [
  {
    menu_name: 'Manage Addresses',
    icon: require('../assets/location.png'),
    route: 'AddressList',
  },
  {
    menu_name: 'Faqs',
    icon: require('../assets/faq.png'),
    route: 'Faq',
  },
  {
    menu_name: 'Privacy Policy',
    icon: require('../assets/privacy.png'),
    route: 'PrivacyPolicy',
  },
  {
    menu_name: 'Log Out',
    icon: require('../assets/logout.png'),
    route: 'Logout',
  },
];

//Image upload options
const options = {
  title: 'Select a photo',
  takePhotoButtonTitle: 'Take a photo',
  chooseFromLibraryButtonTitle: 'Choose from gallery',
};
