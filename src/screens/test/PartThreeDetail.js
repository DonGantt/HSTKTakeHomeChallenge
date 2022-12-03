import { SafeAreaView, Text, FlatList, View, StyleSheet, ActivityIndicator, Button} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import hstkFetch from "../../hstkFetch";
import { useState, useEffect } from "react";

import urls from "../../urls";

export default function({route}) {
    const { postID } = route.params
    const [post, setPost] = useState([])
    const [comments, setComments] = useState([])
    const [isLoading, setLoading] = useState(true)
    const fetchUrl = urls

    useEffect(async ()=>{
        await fetchPost();
        await fetchComments();
    }, [])


    const fetchPost = async () => {
        setLoading(true)

        const postResponse = await hstkFetch(`${fetchUrl.posts}/${postID}`);
        const postData = await postResponse.json();

        setPost(postData);
        setLoading(false);
    }

    const fetchComments = async () => {
        setLoading(true)
        let commentData
        if(await getAsyncStorage() === null){
            const commentResponse = await hstkFetch(`${fetchUrl.posts}/${postID}/comments`);
            commentData = await commentResponse.json();
        } else {
            commentData = await getAsyncStorage()
        }

        setComments(commentData);
        setLoading(false);

    }


    const emptyList = () => {
        return (
          <View>
                {(post.length === 0 || comments.length === 0) && isLoading  ? <Text>Loading</Text> : null}
                 <ActivityIndicator animating={isLoading}></ActivityIndicator>   
            </View>
        )
    }

    const setAsyncStorage = async (currentComments) =>{
        console.log(currentComments)
        try {
            await AsyncStorage.setItem(
              `postID${postID}`,
              JSON.stringify(currentComments)
            );
          } catch (error) {
            console.log("Uh-Oh Something Went Wrong")
            return null
          }
    }

    const getAsyncStorage = async () =>{
        try {
            const localComments = await AsyncStorage.getItem(`postID${postID}`)
            return JSON.parse(localComments) 
          } catch (error) {
            console.log("Uh-Oh Something Went Wrong")
            return null
          }


    }


    const hideComments = async (commentID) => {
        let currentComments = comments.filter(element => element.id !== commentID )
        await setAsyncStorage(currentComments)
        setComments(currentComments)
    }

    const renderList = ({item}) =>  {
        return <List listItem={item}></List>
    }
        
    const List = ({listItem}) => {
        return (
       
                <View style ={ styles.commentStyling}>
                    <View>
                        <Text>{listItem.email}</Text>
                        <Text>{listItem.body}</Text>
                    </View>
                    <Button 
                    title='Hide Comment (This Cannot Be Undone)'
                    onPress={() => hideComments(listItem.id)}
                    style ={ styles.buttonStyling}
                    />
                </View>
       
            
        )
    }
    const renderPost = () => <PostComponent/>

    const PostComponent = () =>{
        return (
            <View style={styles.postStyling}>
                <Text>{post.title}</Text>
                <Text>{post.body}</Text>
            </View>
        )
    }


    return (
        <SafeAreaView>

            <View>
            
                <FlatList
                ListHeaderComponent={renderPost}
                data={comments}
                renderItem = {renderList}
                keyExtractor = {item => item.id}
                ListEmptyComponent = {emptyList}
                
                />
            </View>    
        
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({

   

    commentStyling:{
        borderColor: "black",
        borderWidth: 2,
        padding: 20 ,
        backgroundColor: "silver",
        margin: 10,
    },

    postStyling:{
        borderColor: "black",
        borderWidth: 2,
        padding: 20 ,
    },

    buttonStyling:{
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: "white"

    }
  



})

