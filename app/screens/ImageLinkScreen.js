import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import ListImageScreen from '../components/ListImageScreen';
import ListLinkScreen from '../components/ListLinkScreen';

const renderTabBar = props => (
    <TabBar
        {...props}
        indicatorContainerStyle={{ backgroundColor: '#0cc0df' }}
        indicatorStyle={{ backgroundColor: 'white' }}
        inactiveColor='rgba(255, 255, 255, 0.7)'
        activeColor='white'
    />
);

export default function ImageLinkScreen(user) {

    const route = useRoute();
    const { imageMess, linkMess } = route.params;

    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Hình ảnh' },
        { key: 'second', title: 'Liên kết' },
    ]);
    const ImageRoute = () => <ListImageScreen user={user} imageMess={imageMess}></ListImageScreen>;

    const LinkRoute = () => <ListLinkScreen user={user} linkMess={linkMess}></ListLinkScreen>;

    const renderScene = SceneMap({
        first: ImageRoute,
        second: LinkRoute,
    });

    const navigation = useNavigation();

    

    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Kho lưu trữ',

        });
    }, [navigation]);

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
        />
    );
}