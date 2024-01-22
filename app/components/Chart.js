import * as React from 'react';
import { SearchBar } from 'react-native-elements';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
import { Box, HStack, Icon, Badge } from '@react-native-material/core';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ip from '../../ipConfig';

const Chart = ({ userList }) => {

    const [countUsers, setCountUsers] = React.useState(0);
    const [nameTop4, setNameTop4] = useState([]);
    const [countTop4, setCountTop4] = useState([]);
    useEffect(() => {
        console.log('UserList', userList);
        console.log('UserListCount', userList.length);
        setCountUsers(userList.length);
    }, [userList]);

    useEffect(() => {
        // Gọi API để lấy  top 4
        axios.get(`http://${ip}:3000/users/top4`)
            .then((response) => {
                const data = response.data;
                setNameTop4(data)
                console.log(data);

            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách người dùng:', error);
            });

            axios.get(`http://${ip}:3000/users/top4count`)
            .then((response) => {
                const data = response.data;
                setCountTop4(data)
                console.log(data);

            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách người dùng:', error);
            });
    }, []);

    const labels = nameTop4.map(item => item.fullName);

    return (
        <View>
            <Text style={{ marginLeft: 20, fontSize: 16 }}>Top người dùng sử dụng nhiều nhất</Text>
            <LineChart
                data={{
                    // labels: ["January", "February", "March", "April",],
                    labels: labels,
                    datasets: [
                        {
                            data: [10, 100, 60, 154,]
                        }
                    ]
                }}
                width={Dimensions.get("window").width} // from react-native
                height={220}
                yAxisLabel="" // kí tự trước
                yAxisSuffix="" // kí tự sau
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#1D5D9B", // mày nền
                    backgroundGradientTo: "#75C2F6",  // màu nền
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 0
                    },
                    propsForDots: {
                        r: "5", // bán kính của cái chấm
                        strokeWidth: "2",
                        stroke: "#FFF78A" // màu chấm
                    }
                }}
                bezier
                style={{
                    marginVertical: 20,
                    borderRadius: 16,
                    margin: 20
                }}
            />


            <HStack style={{ margin: 16 }} m={4} spacing={10}>

                <Box
                    style={{
                        width: '100%',
                        height: 220,
                        borderRadius: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',

                    }}>
                    <Text
                        variant="h1"
                        style={{
                            margin: 5,
                            fontSize: 16,
                            textAlign: 'center'
                        }}>
                        Số người dùng
                    </Text>
                    <Box
                        style={{
                            width: '100%',
                            height: 190,
                            backgroundColor: "#75C2F6",
                            borderRadius: 16,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',

                        }}>

                        <Badge
                            label={countUsers}
                            color='#1D5D9B'
                            tintColor='#FBEEAC'
                            style={{
                                width: 160,
                                height: 160,
                                borderRadius: 80,
                                borderColor: '#FBEEAC',
                                borderWidth: 10,
                                fontSize: 20,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            labelStyle={{
                                fontSize: 50,
                            }}
                        />
                    </Box>
                </Box>






                
            </HStack>
        </View>

    );
};



export default Chart;

const styles = StyleSheet.create({


});