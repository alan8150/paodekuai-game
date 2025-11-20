import React from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    Modal,
} from 'react-native';
import { theme } from '../styles/theme';

const Loading = ({ visible = false, text = '加载中...' }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.text}>{text}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 30,
        alignItems: 'center',
        ...theme.shadows.large,
    },
    text: {
        marginTop: 15,
        fontSize: 16,
        color: '#333',
    },
});

export default Loading;
