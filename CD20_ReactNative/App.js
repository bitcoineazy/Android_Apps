import React from 'react';
import {Button, Dimensions, Text, View} from 'react-native';

const YourApp = () => {
  return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>
          Hello world!
        </Text>
        <View style={{marginVertical: 16, borderWidth: 3, width: Dimensions.get('window').width}}/>
        <Button
          title={'press me!'}/>
      </View>
  )
}

export default YourApp;
