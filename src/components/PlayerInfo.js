import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

const PlayerInfo = ({ player, position = 'bottom', isCurrentTurn = false }) => {
    if (!player) return null;

    const { nickname, avatar, cardsRemaining } = player;

    return (
        <View style={[styles.container, styles[position]]}>
            {/* 头像 */}
            <View style={[styles.avatarContainer, isCurrentTurn && styles.currentTurn]}>
                <Image
                    source={{ uri: avatar || 'https://via.placeholder.com/60' }}
                    style={styles.avatar}
                />
                {isCurrentTurn && (
                    <View style={styles.turnIndicator}>
                        <Text style={styles.turnText}>出牌中</Text>
                    </View>
                )}
            </View>

            {/* 玩家信息 */}
            <View style={styles.info}>
                <Text style={styles.nickname} numberOfLines={1}>
                    {nickname}
                </Text>
                {cardsRemaining !== undefined && (
                    <View style={styles.cardsBadge}>
                        <Text style={styles.cardsText}>
                            🎴 {cardsRemaining}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    },
    bottom: {
        bottom: 120,
        left: '50%',
        transform: [{ translateX: -60 }],
    },
    left: {
        top: '50%',
        left: 20,
        transform: [{ translateY: -40 }],
    },
    right: {
        top: '50%',
        right: 20,
        transform: [{ translateY: -40 }],
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: theme.colors.secondary,
        overflow: 'hidden',
        ...theme.shadows.medium,
    },
    currentTurn: {
        borderColor: theme.colors.primary,
        borderWidth: 4,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    turnIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.primary,
        paddingVertical: 2,
    },
    turnText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    info: {
        marginTop: 8,
        alignItems: 'center',
    },
    nickname: {
        color: theme.colors.textLight,
        fontSize: theme.fontSizes.sm,
        fontWeight: 'bold',
        maxWidth: 100,
    },
    cardsBadge: {
        marginTop: 4,
        backgroundColor: theme.colors.card,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.md,
    },
    cardsText: {
        color: theme.colors.textLight,
        fontSize: theme.fontSizes.xs,
    },
});

export default PlayerInfo;
