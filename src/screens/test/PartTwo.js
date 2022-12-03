import { SafeAreaView, Text, FlatList, View, StyleSheet, ActivityIndicator, TextInput} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import hstkFetch from "../../hstkFetch";
import { useState, useEffect } from "react";
import urls from "../../urls";

export default function () {
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [isLoading, setLoading] = useState(true)
    const fetchUrl = urls

    useEffect(()=>{
        fetchData()
    }, [])

    const fetchData = async () => {
        const response = await hstkFetch(fetchUrl.posts);
        const data = await response.json();
        setData(data);
        setFilteredData(data);
        setLoading(false);
    }

    const renderSearchBar = () =>{
        return (
        <TextInput
        style = {styles.searchBar}
        onChangeText={onUserInput}
        placeholder={"Search By Title"}
        />    
        )
    }

    const emptyList = () => {
        return (
            <View>
                {filteredData.length == 0 && isLoading ? <Text>No Results</Text> : null}
                 <ActivityIndicator animating={isLoading}></ActivityIndicator>   
            </View>
        )
    }

    const onUserInput = (userInput) => {
        const response = data.filter( element => element.title.toLowerCase().includes(userInput.toLowerCase()) ) 
        setFilteredData(response)
    }
   

    const renderList = ({item}) =>  {
        return <List listItem={item}></List>
    }
        

   

    return (
        <SafeAreaView>
                <FlatList
                ListHeaderComponent={renderSearchBar()}
                data={filteredData}
                renderItem = {renderList}
                keyExtractor = {item => item.id}
                ListEmptyComponent = {emptyList}
                stickyHeaderIndices = { [0] }
                />
        </SafeAreaView>
    )
}

const List = ({listItem}) => {
    return (
        <View style = {styles.listRow}>
            <AntDesign name='check' size={12}/>
            <View style = {styles.itemColumn}> 
                <Text>{listItem.title}</Text>
                <Text>{listItem.id}</Text>
            </View>
            <AntDesign style={{marginLeft: "auto"}} name='right' size={12}/>
        </View>
    )
}

const styles = StyleSheet.create({

    listRow:{
        padding:12,
        flexDirection: "row",
        maxWidth: "100%"
    },

    itemColumn:{
        flexDirection: "column",
        flexBasis: "100%",
        maxWidth: "50%",
    },

    searchBar:{
        borderColor: "black",
        borderWidth: 1,
        height: 50,
        margin: 10

    }



})

