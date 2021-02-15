// @ts-nocheck
import React, { useState, useEffect, useCallback, memo } from 'react';
import {
   View,
   Text,
   TouchableOpacity,
   Image,
   ActivityIndicator,
   FlatList,
   StyleSheet
} from 'react-native';
import {
   Placeholder,
   PlaceholderMedia,
   PlaceholderLine,
   Fade,
   ShineOverlay,
   Shine
} from "rn-placeholder";

const ItemView = memo(({ item }) => {

   useEffect(() => {
      console.log('Render Item', item.id.toString());
      // unmount
      return () => console.log('Remove Item', item.id.toString());
   }, [])

   return (
      <TouchableOpacity style={styles.listItem} onPress={() => null}>
         <Image
            source={{ uri: item.thumbnailUrl }}
            style={styles.thumbnail}
         />
         <Text style={styles.itemTxt} numberOfLines={2} >{[item.id, item.title].join('. ')}</Text>
      </TouchableOpacity>
   )
})

const Footer = memo(({ init, loading, error }) => {
   useEffect(() => {
      console.log('render Footer', loading ? 'Start' : 'End');
   }, [])

   return loading ? <MyPlaceholder n={init ? 50 : 2} /> : null;
})

const useCustomeHooks = () => {
   const [dataSource, setDataSource] = useState([]);
   const [page, setPage] = useState(1);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const fetchData = useCallback(() => setLoading(true), []);

   const getData = () => {
      if (error) setError(null);
      console.log('render page', page.toString());
      fetch(`https://jsonplaceholder.typicode.com/albums/${page}/photos`)
         .then(resp => resp.json())
         .then(resp => {
            setLoading(false);
            setPage(page + 1)
            setDataSource([...dataSource, ...resp])
         })
         .catch(err => {
            console.log(err);
            setError('Failed Fetch Data, Please Try Again Later');
            setLoading(false)
         })
   }

   useEffect(() => {
      if (!loading) return;
      setTimeout(() => {
         getData()
      }, 1500);
   }, [loading])

   return [loading, dataSource, fetchData, error]

}

const MyPlaceholder = ({ n }) => {

   const renderItem = () => <Placeholder
      Animation={Shine}
      Left={PlaceholderMedia}
      // Left={() => <PlaceholderMedia size={80} style={{ marginRight: 5}} />}
      style={styles.listItem}
   >
      <PlaceholderLine />
      <PlaceholderLine width={50} />
   </Placeholder>

   return <FlatList
      data={Array(n || 10).fill({})}
      renderItem={renderItem}
      keyExtractor={(_, i) => i.toString()}
   />
}

const App = () => {
   const [loading, dataSource, fetchData, error] = useCustomeHooks();
   const [init, setInit] = useState(true)

   const renderItem = useCallback(({ item }) => <ItemView item={item} />, [])
   const keyExtractor = useCallback(item => item.id.toString(), [])
   const renderFooter = useCallback(() => <Footer init={init} loading={loading} error={error} />, [loading, error])

   useEffect(() => {
      console.log('Render APP');
      setInit(false)
   }, [])

   return (
      <FlatList
         data={dataSource}
         renderItem={renderItem}
         keyExtractor={keyExtractor}
         ListFooterComponent={renderFooter}
         onEndReachedThreshold={0.2}
         onEndReached={fetchData}
      />
   );
};

const styles = StyleSheet.create({
   listItem: {
      flexDirection: 'row',
      marginTop: 10,
      paddingVertical: 10,
      paddingHorizontal: 10,
      backgroundColor: '#fff',
   },
   itemTxt: {
      flex: 1,
      paddingVertical: 10,
      paddingLeft: 10,
      color: 'black',
   },
   thumbnail: {
      width: 50,
      height: 50,
      borderRadius: 8
   },
   footer: {
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
   },
   loadMoreBtn: {
      padding: 10,
      backgroundColor: '#800000',
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
   },
   btnText: {
      color: 'white',
      fontSize: 15,
      textAlign: 'center',
   },
})
export default App;