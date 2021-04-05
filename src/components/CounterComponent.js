import React from 'react';
import {View, Image, TouchableOpacity, Text} from 'react-native';
import ResponsiveText from "./ResponsiveText";
import add from "../assets/add.png";
import subtract from "../assets/subtract.png";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

class CounterComponent extends React.Component {
  render() {
    const {
      value, onIncrement, onDecrement
    } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.touchableElevation} onPress={() => onDecrement(value)}>
          <Image
            source={subtract}
            style={styles.leftImageStyle}
          />
        </TouchableOpacity>
        <ResponsiveText style={styles.textStyle}>{value}</ResponsiveText>
        <TouchableOpacity style={styles.touchableElevation} onPress={() => onIncrement(value)}>
          <Image
            source={add}
            style={styles.rightImageStyle}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

export default CounterComponent;

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableElevation:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  leftImageStyle: {
    height: wp("12%"),
    width: wp("12%"),
  },
  rightImageStyle: {
    height: wp("12%"),
    width: wp("12%"),
  },
  textStyle: {
    fontSize: "6%",
    marginHorizontal: 5
  },
};
