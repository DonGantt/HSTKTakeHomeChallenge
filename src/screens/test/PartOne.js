import { SafeAreaView, Text, FlatList, View, StyleSheet } from "react-native";
import localPlaceholderData from "../../localPlaceholderData";
import { AntDesign } from "@expo/vector-icons";


export default function () {
    return (
        <SafeAreaView>
                <FlatList
                data={localPlaceholderData}
                renderItem = {renderList}
                keyExtractor = {item => item.id}
                />
        </SafeAreaView>
    )
}

const renderList = ({item}) => <List listItem={item}></List>

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
    }

})