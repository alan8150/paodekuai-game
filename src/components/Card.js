import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 8;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

const Card = ({ card, selected = false, onPress }) => {
    if (!card) return null;

    // 解析牌面（例如：'♠A'）
    const suit = card[0]; // 花色
    const value = card.slice(1); // 牌值

    // 判断颜色（红桃♥和方块♦为红色）
    const isRed = suit === '♥' || suit === '♦';
    const color = isRed ? theme.colors.cardRed : theme.colors.cardBlack;

    return (
        <View
            style={[
                styles.container,
                selected && styles.selected,
            ]}
            onTouchStart={onPress}
        >
            <LinearGradient
                colors={['#FFFFFF', '#F5F5F5']}
                style={styles.cardGradient}
            >
                {/* 左上角 */}
                <View style={styles.corner}>
                    <Text style={[styles.value, { color }]}>{value}</Text>
                    <Text style={[styles.suit, { color }]}>{suit}</Text>
                </View>

                {/* 中间大花色 */}
                <View style={styles.centerView}>
                    <Text style={[styles.centerSuit, { color }]}>{suit}</Text>
                </View>

                {/* 右下角（翻转） */}
                <View style={[styles.corner, styles.cornerBottom]}>
                    <Text style={[styles.suit, { color }]}>{suit}</Text>
                    <Text style={[styles.value, { color }]}>{value}</Text>
                </View>

                {/* 中国风装饰边框 */}
                <View style={styles.border} />
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        margin: 2,
    },
    selected: {
        transform: [{ translateY: -20 }],
    },
    cardGradient: {
        width: '100%',
        height: '100%',
        borderRadius: theme.borderRadius.md,
        borderWidth: 2,
        borderColor: theme.colors.secondary,
        ...theme.shadows.medium,
    },
    corner: {
        position: 'absolute',
        top: 4,
        left: 4,
        alignItems: 'center',
    },
    cornerBottom: {
        top: undefined,
        left: undefined,
        bottom: 4,
        right: 4,
        transform: [{ rotate: '180deg' }],
    },
    value: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    suit: {
        fontSize: 12,
    },
    centerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerSuit: {
        fontSize: 32,
    },
    border: {
        position: 'absolute',
        top: 2,
        left: 2,
        right: 2,
        bottom: 2,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: theme.colors.secondary + '40',
    },
});

export default Card;
