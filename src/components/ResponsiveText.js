import React from 'react';
import { Text} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export default class ResponsiveText extends React.Component {
  render() {
    const {style, children} = this.props;
    let fontSize = wp('4%');
    if (style && style.fontSize) fontSize = wp(style.fontSize);
    return (
      <Text style={{...styles.text, ...this.props.style, ...{fontSize}}}>
        {children}
      </Text>
    );
  }
}

const styles = {
  text: {
    color: '#000',
  },
};
