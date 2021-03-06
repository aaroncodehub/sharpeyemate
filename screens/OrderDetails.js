import React, { useState } from "react";
import { useSelector } from 'react-redux';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    LayoutAnimation,
    FlatList,
    ImageBackground,
    Alert,
    ActivityIndicator,
    Modal,
} from "react-native";

import {

    AntDesign
} from "@expo/vector-icons";
import { Text, Block } from '../components';
import { theme } from '../constants';
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios'
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';


const OrderDetails = props => {
    const bgImage = require('../assets/header.jpg')
    LayoutAnimation.easeInEaseOut()
    order = props.navigation.getParam('item')
    const profile = useSelector(state => state.myReducer.userProfile)
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [drawings, setDrawings] = useState(null)

    const handleDownload = () => {
        setLoading(true)
        axios({
            method: "GET",
            url:
                "https://api.sharpeye.co.nz/api/v1/model/sale.order/" +
                order.id +
                "/attachments?all_attachments=True",
            headers: {
                "access_token": profile.accessToken,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => {

                if (response.data.attachments.length !== 0) {
                    setDrawings(response.data.attachments)
                    setModalVisible(true)
                    // const fileName = response.data.attachments[0].name
                    // const base64Code = response.data.attachments[0].base64
                    // const fileUri = FileSystem.documentDirectory + `${encodeURI(fileName)}`
                    // FileSystem.writeAsStringAsync(fileUri, base64Code, { encoding: FileSystem.EncodingType.Base64 });
                    // Sharing.shareAsync(fileUri);
                    setLoading(false)
                    // const mediaResult = await MediaLibrary.saveToLibraryAsync(filename);
                } else {
                    setLoading(false)
                    Alert.alert('Oops !', 'no drawing exists', [{ text: 'OK' }]);
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err.message)
            });
    }

    const handleDownloadDrawing = (name, base64Code) => {
        const fileUri = FileSystem.documentDirectory + `${encodeURI(name)}`
        FileSystem.writeAsStringAsync(fileUri, base64Code, { encoding: FileSystem.EncodingType.Base64 });
        Sharing.shareAsync(fileUri);

    }

    renderOrderLine = orderLine => {
        if (
            orderLine.product_id[0] == 2380 ||
            orderLine.product_id[0] == 22 ||
            orderLine.product_id[0] == 23 ||
            orderLine.product_id[0] == 24 ||
            orderLine.product_id[0] == 25 ||
            orderLine.product_id[0] == 2522 ||
            orderLine.product_id[0] == 2303 ||
            orderLine.product_id[0] == 26 ||
            orderLine.product_id[0] == 27 ||
            orderLine.product_id[0] == 28 ||
            orderLine.product_id[0] == 29 ||
            orderLine.product_id[0] == 2083 ||
            orderLine.product_id[0] == 2529 ||
            orderLine.product_id[0] == 30 ||
            orderLine.product_id[0] == 2530
        ) {
            return (
                <View style={styles.feedItem}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: 'center', justifyContent: 'space-around' }}>
                        <View>
                            <Text h4 bold>{orderLine.name}</Text>
                        </View>
                        <View>
                            <Text gray2 caption style={styles.title}>{orderLine.width}</Text>
                        </View>
                        <View>
                            <Text gray2 caption style={styles.title}>{orderLine.height}</Text>
                        </View>
                        <View>
                            <Text gray2 captionstyle={styles.title}>{orderLine.number_of_pieces} PCs</Text>
                        </View>
                    </View>
                </View>
            )
        }
    }
    renderOrder = order => {
        return (
            <FlatList
                ListHeaderComponent={
                    <>
                        <View style={{ ...styles.feedItem, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ alignItems: 'center' }}>
                                <Ionicons name='ios-create' size={36} color='#2980b9' />
                                <Text semibold>{order.sales_order_status}</Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Ionicons name='ios-speedometer' size={36} color='#2980b9' />
                                <Text semibold>{order.manufacturing_status_of_sales_order}</Text>
                            </View>
                            <TouchableOpacity style={{ alignItems: 'center' }} onPress={handleDownload}>
                                {loading ? <View>
                                    <ActivityIndicator size='large' color={theme.colors.primary} />
                                </View> :
                                    <View>
                                        <Ionicons name='md-cloud-download' size={36} color='#2980b9' />
                                    </View>
                                }
                                <Text semibold>drawings</Text>
                            </TouchableOpacity>

                        </View>
                        <View style={styles.feedItem}>
                            <View style={{ flex: 1 }}>
                                <View style={styles.details}>
                                    <Text style={styles.text}>Reference</Text>
                                    <Text gray caption center style={styles.text}>{order.client_order_ref}</Text>
                                </View>
                                <View style={styles.details}>
                                    <Text style={styles.text}>Customer Request</Text>
                                    <Text gray caption center style={styles.text}>{order.customer_request}</Text>
                                </View>
                                <View style={styles.details}>
                                    <Text style={styles.text}>Sharpeye Note</Text>
                                    <Text gray caption center style={styles.text}>{order.app_memo}</Text>
                                </View>
                                <View style={styles.details}>
                                    <Text style={styles.text}>Contact Name</Text>
                                    <Text gray caption center style={styles.text}>{order.contact_name}</Text>
                                </View>
                                <View style={styles.details}>
                                    <Text style={styles.text}>Contact Phone</Text>
                                    <Text gray caption center style={styles.text}>{order.mobile}</Text>
                                </View>
                                <View style={styles.details}>
                                    <Text style={styles.text}>Deliver Method</Text>
                                    <Text gray caption center style={styles.text}>{order.delivery_method}</Text>
                                </View>

                                <View style={styles.details}>
                                    <Text style={styles.text}>Shipping Address</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <Text gray caption center style={styles.text}>{order.alternate_shipping_address}</Text>
                                </View>


                            </View>
                        </View>
                    </>
                }
                data={order.order_line}
                renderItem={({ item }) => renderOrderLine(item)}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
            ></FlatList>
        )
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={bgImage}
                style={styles.header}
            >
                <Block style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <AntDesign name="arrowleft" size={36} color='white'></AntDesign>
                    </TouchableOpacity>
                    <Text center h2 bold white>{order.name}</Text>
                </Block>
            </ImageBackground>
            {/* <ScrollView style={styles.feed}>
                {renderOrder(order)}
            </ScrollView> */}
            <View style={{ ...styles.feed, flex: 1 }}>
                {renderOrder(order)}
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        {
                            drawings?.map((drawing, index) => (
                                <TouchableOpacity onPress={() => handleDownloadDrawing(drawing.name, drawing.base64)} key={index}>
                                    <Text style={styles.modalText}>{drawing.name}</Text>
                                </TouchableOpacity>
                            ))
                        }

                        <TouchableOpacity
                            style={{ ...styles.openButton, backgroundColor: '#2980b9' }}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}>
                            <Text style={styles.textStyle}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );

}

OrderDetails.navigationOptions = {
    header: null
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EBECF4"
    },
    header: {
        left: 0,
        right: 0,
        top: 0,
        paddingTop: 80,
        paddingBottom: 36,
        backgroundColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EBECF4",
        shadowColor: "#454D65",
        shadowOffset: { height: 5 },
        shadowRadius: 15,
        shadowOpacity: 0.2,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.sizes.base * 2
    },
    feed: {
        marginHorizontal: 16,
        zIndex: 10,
        marginTop: -32

    },
    feedItem: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 18,
        flexDirection: "row",
        marginTop: 2,
    },
    title: {
        marginHorizontal: 6
    },

    details: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between'
    },
    text: {
        marginVertical: 6,
        alignSelf: "flex-end"
    },


    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        borderRadius: 100,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {

        marginBottom: 20,
        textAlign: 'center',
    },

});

export default OrderDetails;