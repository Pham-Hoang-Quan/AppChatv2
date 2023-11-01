import * as React from 'react';
import { SearchBar } from 'react-native-elements';
import { StyleSheet } from 'react-native';

const SearchUserList = () => {
    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = query => setSearchQuery(query);

    return (
        <SearchBar
            placeholder="Tìm kiếm..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            containerStyle={styles.containerStyle}
            inputStyle={styles.inputStyle}
            // lightTheme = {'true'}
            inputContainerStyle  = {styles.inputContainerStyle}
        />
    );
};



export default SearchUserList;

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: 'white', // Đổi màu nền thành màu trắng
        borderBottomColor: 'transparent', // Ẩn viền dưới thanh tìm kiếm
        borderTopColor: 'transparent', // Ẩn viền trên thanh tìm kiếm
        color: 'white',
        borderRadius: 30,
        // height: 40,
        marginRight: 10,
        marginLeft:10,
        marginBottom: 10,
        fontSize: '10px',
        shadowColor: 'black', 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, 
        elevation: 4,
        
        
    },
    inputStyle: {
        color: 'gray', // Đổi màu văn bản thành màu trắng
        backgroundColor: 'white',
        borderRadius: 30,
        fontSize: 16,
        height: 50,
        
    },
    inputContainerStyle: {
        color: 'white',
        backgroundColor: 'white',
        borderRadius: 30,
        height: 25,
        // shadowColor: 'black', 
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.3, 
        // elevation: 4,
        // borderBottomColor: 'black',
        
    },
    
  });