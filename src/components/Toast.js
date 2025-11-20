import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
} from 'react-native';
import { theme } from '../styles/theme';

const Toast = ({ visible, message, type = 'success', duration = 2000, onHide }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // 淡入
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            // 自动隐藏
            const timer = setTimeout(() => {
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    onHide && onHide();
                });
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'info':
                return 'ℹ';
            default:
                return '✓';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success':
                return '#4CAF50';
            case 'error':
                return '#f44336';
            case 'warning':
                return '#ff9800';
            case 'info':
                return theme.colors.primary;
            default:
                return '#4CAF50';
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                { opacity, backgroundColor: getColor() },
            ]}
        >
            <Text style={styles.icon}>{getIcon()}</Text>
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 100,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        ...theme.shadows.large,
        zIndex: 9999,
    },
    icon: {
        fontSize: 20,
        color: '#fff',
        marginRight: 10,
        fontWeight: 'bold',
    },
    message: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
    },
});

export default Toast;
