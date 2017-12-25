import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import { 
  Container, 
  Header, 
  Content, 
  List, 
  ListItem, 
  Thumbnail, 
  Text,
  Body, 
  Left, 
  Right, 
  Badge, 
  Picker, 
  Form, 
  Button,
  Icon,
  Item as FormItem, } from 'native-base';

import Display from 'react-native-display';

const Item = Picker.Item;

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title:'Orders',
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      past_orders:[],
      active_orders:[],
      selected1: "key0",
      enable1: true,
      enable2: true,
    }
    /*console.log(this.state.selected1);
    console.log(this.state.enable1);
    console.log(this.state.enable2);*/
  }

  componentDidMount = async () => {
    let token = await AsyncStorage.getItem('token');
    
    fetch('http://192.168.0.102:8082/users/orders/0001',{
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
          'Host': '192.168.0.102:8082'
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          past_orders:responseJson.past_orders,
          active_orders:responseJson.active_orders,
        }, function() {
          console.log(this.state.past_orders);
          console.log(this.state.active_orders);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  onValueChange(value: string) {
    this.setState({
      selected1: value
    });
    {
      value == 'key0' ? (this.state.enable1 = true , this.state.enable2 = true) : (value == 'key1' ? (this.state.enable2 = false , this.state.enable1 = true) : (this.state.enable2 = true , this.state.enable1 = false)) 
    }
    /*
    console.log(this.state.selected1);
    console.log(value);
    console.log(this.state.enable1);
    console.log(this.state.enable2);*/
  }

  render() {

   /* if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }*/

    const { navigate } = this.props.navigation;
   /* var orders =   [{"id":"#11085","amount":"50","status":"Waiting","time":"31 Jan 1:24 pm"},
                    {"id":"#11084","amount":"50","status":"Confirmed","time":"31 Jan 1:24 pm"},
                    {"id":"#11083","amount":"320","status":"Dispatched","time":"31 Jan 1:24 pm"},
                    {"id":"#11082","amount":"320","status":"Dispatched","time":"31 Jan 1:24 pm"}];

    var past_orders =[{"id":"#11081","amount":"50","status":"Delivered","time":"31 Jan 1:24 pm"},
                    {"id":"#11080","amount":"100","status":"Cancelled","time":"31 Jan 1:24 pm"},
                    {"id":"#11079","amount":"320","status":"Delivered","time":"31 Jan 1:24 pm"}];*/
    
    return (
      <Container style={styles.container}>
        <Content>
          <View style={{flexDirection:'row',justifyContent: 'space-between',paddingBottom:20}}>
            <Left>
              <Button 
                light 
                block
                style={styles.refreshButtonStyle}>
                <View style={{ flex:2,flexDirection: 'row' ,alignItems: 'center', justifyContent:'flex-end'}}>
                  <Picker
                    style={ styles.pickerStyle }
                    iosHeader="Select one"
                    mode="dropdown"
                    selectedValue={this.state.selected1}
                    onValueChange={this.onValueChange.bind(this)}>
                    <Item label="All Orders" value="key0" />
                    <Item label="Active Orders" value="key1" />
                    <Item label="Past Orders" value="key2" />
                  </Picker>
                </View>
              </Button>
            </Left>
            <Right>
              <Button
                onPress={this.componentDidMount} 
                iconLeft 
                block 
                light 
                style={styles.refreshButtonStyle}>
                <Icon name='refresh' />
                <Text> Refresh </Text>
              </Button>
            </Right>
          </View>

          <Display enable={this.state.enable1}>
            <Text style={ styles.boldtext }>Active Orders({this.state.active_orders.length})</Text>
            <List dataArray={this.state.active_orders}
              renderRow={(order) =>
              <ListItem>
                <View style={styles.view}>
                    <View style={{ flexDirection:'row',justifyContent: 'space-between',alignItems:'flex-start' }}>
                      <Text>#{order.order_id}</Text>
                      <Text>₹{order.total}</Text>
                    </View>

                    <View style={{ flexDirection:'row',justifyContent: 'space-between',alignItems:'flex-start' }}>
                      {
                        order.status == 'Waiting' ?
                        (<Text style={{ color: '#2f95dc',textAlign: 'center', fontSize:15, fontWeight:'bold' }}>{order.status}</Text>)
                        :
                        (
                        order.status == 'Confirmed' ?
                          (
                            <Text style={{ color: '#00b200',textAlign: 'center', fontSize:15, fontWeight:'bold' }}>{order.status}</Text>
                          )
                          :
                          (
                            <Text style={{ color: '#E69500',textAlign: 'center', fontSize:15, fontWeight:'bold' }}>{order.status}</Text>
                          )
                        )
                      }
                      <Text note>{order.time}</Text>    
                    </View>
                  </View>
                </ListItem>
              }>
            </List>
          </Display>


          <Display enable={this.state.enable2}>
            <Text style={{ fontWeight:'bold', paddingTop:20 }}>Past Orders({this.state.past_orders.length})</Text>
             <List dataArray={this.state.past_orders}
              renderRow={(order) =>
              <ListItem>
                <View style={styles.view}>
                    <View style={{ flexDirection:'row',justifyContent: 'space-between',alignItems:'flex-start' }}>
                      <Text>#{order.order_id}</Text>
                      <Text>₹{order.total}</Text>
                    </View>

                    <View style={{ flexDirection:'row',justifyContent: 'space-between',alignItems:'flex-start' }}>
                      {
                        order.status == 'Delivered' ?
                        (<Text style={{ color: '#2f95dc',textAlign: 'center', fontSize:15, fontWeight:'bold' }}>{order.status}</Text>)
                        :
                        (<Text style={{ color: '#ff1919',textAlign: 'center', fontSize:15, fontWeight:'bold' }}>{order.status}</Text>)
                      }
                      <Text note>{order.time}</Text>    
                    </View>
                  </View>
                </ListItem>
              }>
            </List>
            </Display>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    paddingLeft:10,
  },
  boldcolortext:{
    fontWeight:'bold',
    color: '#3498db'
  },
  boldtext:{
    fontWeight:'bold',
  },
  lefttext:{
    fontWeight:'bold',
    fontSize: 30,
    color: '#2980b9'
  },
   pickerStyle: {
    width:160, 
    height:20, 
    justifyContent:'flex-end', 
    alignItems:'center', 
    color:'#000',
  },
  view: {
    flex:1,
    flexDirection:'column',
    justifyContent: 'space-between',
    alignItems: 'stretch' 
  },
  innerviewleft: {
    flexDirection:'column',
    justifyContent: 'flex-start',
    alignItems:'flex-start'
  },
  innerviewright: {
    flexDirection:'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end', 
  },
  boldtext:{
    fontWeight:'bold',
  },
  refreshButtonStyle:{
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius:10,
  },
  refreshIconStyle: {
    fontSize: 20,
    height: 22,
    color: 'black',
  },
});
