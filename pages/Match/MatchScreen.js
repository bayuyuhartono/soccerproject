import React, { Component } from 'react';
import { FlatList, ActivityIndicator, Text, View, StyleSheet, ScrollView  } from 'react-native';
import { Section} from "react-native-tableview-simple";

ShowCurrentDate=()=>{
 
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();

  Alert.alert(date + '-' + month + '-' + year);

 }

export default class AlignItemsBasics extends Component {

    constructor(props){
        super(props);
        this.getListCall= this.getListCall.bind(this);
        this.state ={ isLoading: true}
      }
      
      componentDidMount(){
        this.getListCall();
      }
    
      getListCall(){
            return fetch('https://apifootball.com/api/?action=get_events&from=2018-08-01&to=2019-05-30&league_id=62&APIkey=8bf04e3397a3defe0895d9377b201c08a1bd351097c61bc7efabaa9a5c7d9038')
            .then((response) => response.json())
            .then((responseJson) => {  
              let FTresponseJson = responseJson.filter(item => item.match_status == "FT"); //filter data json fetch FT     
              let UPCresponseJson = responseJson.filter((item) => new Date(item.match_date) >= new Date()); //filter data json fetch UPC
              
              this.setState({
                isLoading: false,
                dataSourceFT: FTresponseJson.sort((a, b) => Date.parse(b.match_date) - Date.parse(a.match_date)), //sort data json fetch,
                dataSourceUPC: UPCresponseJson.sort((a, b) => Date.parse(a.match_date) - Date.parse(b.match_date)) //sort data json fetch,
              });
       
            })
            .catch((error) =>{
              console.error(error);
            });
      }

  render() {

    if(this.state.isLoading){
        return(
          <View style={{flex: 1, padding: 20}}>
            <ActivityIndicator/>
          </View>
        )
      }

    return (
      // Try setting `alignItems` to 'flex-start'
      // Try setting `justifyContent` to `flex-end`.
      // Try setting `flexDirection` to `row`.
      <ScrollView>
        <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            }}>
            <View style={{height: 50, backgroundColor: 'white'}} >
                <Section header="UPCOMING MATCH"></Section>
            </View>
            <View style={{height: 400, backgroundColor: 'skyblue'}} >
                <ScrollView style={styles.scrollContainer}>
                    <FlatList
                    data={this.state.dataSourceUPC} 
                    renderItem={({item}) => 
                        <View key={item.match_id} style={styles.note}>
                            <Text style={styles.noteText}>{item.match_hometeam_name} VS {item.match_awayteam_name}</Text>
                            <Text style={styles.noteText}>{item.match_date} - {item.match_time}</Text>
                        </View>
                        } 
                        keyExtractor={({match_id}, index) => match_id} 
                    />
                </ScrollView>
            </View>
            <View style={{height: 50, backgroundColor: 'white'}} >
                <Section header="LATEST MATCH"></Section>
            </View>
            <View style={{height: 400, backgroundColor: 'skyblue'}} >
                <ScrollView style={styles.scrollContainer}>
                    <FlatList
                    data={this.state.dataSourceFT} 
                    renderItem={({item}) => 
                        <View key={item.match_id} style={styles.note}>
                            <Text style={styles.noteText}>{item.match_hometeam_name} [{item.match_hometeam_score}:{item.match_awayteam_score}] {item.match_awayteam_name}</Text>
                            <Text style={styles.noteText}>{item.match_date} - {item.match_time}</Text>
                        </View>
                        } 
                        keyExtractor={({match_id}, index) => match_id} 
                    />
                </ScrollView>
            </View>
        </View>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      backgroundColor: '#3366cc',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 2,
      borderBottomColor: '#ddd',
    },
    textheader: {
      color: 'white',
      fontSize: 18,
      paddingTop: 15,
      paddingBottom: 15,
    },
    scrollContainer:{
      flex: 1,
    },
    note:{
        position: 'relative',
        padding: 10,
        paddingRight: 100,
        borderBottomWidth: 2,
        borderBottomColor: '#ededed',
    },
    noteText: {
        paddingLeft: 20,
        borderLeftColor: '#3366cc',
    }
  });