import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import socketService from '../services/socket';
import Card from '../components/Card';
import PlayerInfo from '../components/PlayerInfo';
import { theme } from '../styles/theme';

const GameScreen = ({ route, navigation }) => {
    const [room, setRoom] = useState(route.params?.room || null);
    const [myCards, setMyCards] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [lastPlay, setLastPlay] = useState(null);

    useEffect(() => {
        setupSocketListeners();

        return () => {
            // 清理监听器
            socketService.off('playerReady');
            socketService.off('gameStarted');
            socketService.off('cardPlayed');
            socketService.off('playerPassed');
            socketService.off('gameOver');
            socketService.off('playerLeft');
        };
    }, []);

    const setupSocketListeners = () => {
        socketService.on('playerReady', handlePlayerReady);
        socketService.on('gameStarted', handleGameStarted);
        socketService.on('gameStateUpdated', handleGameStateUpdated);
        socketService.on('cardPlayed', handleCardPlayed);
        socketService.on('playerPassed', handlePlayerPassed);
        socketService.on('gameOver', handleGameOver);
        socketService.on('playerLeft', handlePlayerLeft);
        socketService.on('error', handleError);
    };

    const handlePlayerReady = (data) => {
    set Room(data.room);
    };

    const handleGameStarted = (data) => {
        setRoom(data.room);
        // 找到自己的手牌
        const myPlayer = data.room.players.find(p => p.cards.length > 0);
        if (myPlayer) {
            setMyCards(myPlayer.cards);
        }
    };

    const handleGameStateUpdated = (data) => {
        setRoom(prev => ({ ...prev, ...data }));
    };

    const handleCardPlayed = (data) => {
        setLastPlay(data.lastPlay);
        setRoom(prev => ({
            ...prev,
            currentTurn: data.currentTurn,
            lastPlay: data.lastPlay,
        }));

        // 如果是自己的牌，从手牌中移除
        if (data.playerId === getUserId()) {
            setMyCards(prev => prev.filter(card => !data.cards.includes(card)));
            setSelectedCards([]);
        }
    };

    const handlePlayerPassed = (data) => {
        setRoom(prev => ({
            ...prev,
            currentTurn: data.currentTurn,
            lastPlay: data.lastPlay,
        }));
    };

    const handleGameOver = (data) => {
        Alert.alert(
            '游戏结束',
            `恭喜 ${data.winner.nickname} 获胜！`,
            [
                {
                    text: '返回大厅',
                    onPress: () => {
                        socketService.leaveRoom();
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    const handlePlayerLeft = (data) => {
        if (data.room) {
            setRoom(data.room);
        } else {
            Alert.alert('提示', '房间已解散', [
                { text: '确定', onPress: () => navigation.goBack() },
            ]);
        }
    };

    const handleError = (data) => {
        Alert.alert('错误', data.message);
    };

    const getUserId = () => {
        // 这里应该从AsyncStorage获取当前用户ID
        // 简化处理
        return room?.players[0]?.userId;
    };

    const isMyTurn = () => {
        if (!room) return false;
        const currentPlayer = room.players[room.currentTurn];
        return currentPlayer?.userId === getUserId();
    };

    const toggleCardSelection = (card) => {
        if (selectedCards.includes(card)) {
            setSelectedCards(prev => prev.filter(c => c !== card));
        } else {
            setSelectedCards(prev => [...prev, card]);
        }
    };

    const handleReady = () => {
        socketService.ready();
    };

    const handlePlayCards = () => {
        if (selectedCards.length === 0) {
            Alert.alert('提示', '请选择要出的牌');
            return;
        }

        socketService.playCards(selectedCards);
    };

    const handlePass = () => {
        socketService.pass();
    };

    const handleLeaveRoom = () => {
        Alert.alert(
            '确认',
            '确定要离开房间吗？',
            [
                { text: '取消', style: 'cancel' },
                {
                    text: '确定',
                    onPress: () => {
                        socketService.leaveRoom();
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    if (!room) {
        return (
            <View style={styles.loading}>
                <Text style={styles.loadingText}>加载中...</Text>
            </View>
        );
    }

    return (
        <LinearGradient
            colors={['#2C1810', '#4A3426']}
            style={styles.container}
        >
            {/* 顶部信息栏 */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={handleLeaveRoom} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← 离开</Text>
                </TouchableOpacity>
                <Text style={styles.roomId}>房间: {room.roomId.slice(-6)}</Text>
                <View style={styles.placeholder} />
            </View>

            {/* 游戏区域 */}
            <View style={styles.gameArea}>
                {/* 其他玩家 */}
                {room.players.length >= 2 && (
                    <PlayerInfo
                        player={room.players[1]}
                        position="left"
                        isCurrentTurn={room.currentTurn === 1}
                    />
                )}
                {room.players.length >= 3 && (
                    <PlayerInfo
                        player={room.players[2]}
                        position="right"
                        isCurrentTurn={room.currentTurn === 2}
                    />
                )}

                {/* 中央牌桌区域 */}
                <View style={styles.centerArea}>
                    {lastPlay && lastPlay.cards && lastPlay.cards.length > 0 && (
                        <View style={styles.lastPlayArea}>
                            <Text style={styles.lastPlayLabel}>上家出牌</Text>
                            <View style={styles.lastPlayCards}>
                                {lastPlay.cards.map((card, idx) => (
                                    <Card key={idx} card={card} />
                                ))}
                            </View>
                            <Text style={styles.cardType}>{lastPlay.cardType}</Text>
                        </View>
                    )}

                    {!lastPlay && room.status === 'waiting' && (
                        <View style={styles.waitingArea}>
                            <Text style={styles.waitingText}>等待玩家加入...</Text>
                            <Text style={styles.waitingSubtext}>
                                {room.players.length}/3 人
                            </Text>
                        </View>
                    )}
                </View>

                {/* 当前玩家 */}
                {room.players.length >= 1 && (
                    <PlayerInfo
                        player={room.players[0]}
                        position="bottom"
                        isCurrentTurn={room.currentTurn === 0}
                    />
                )}
            </View>

            {/* 底部手牌区域 */}
            <View style={styles.handArea}>
                {room.status === 'waiting' || room.status === 'ready' ? (
                    <TouchableOpacity style={styles.readyButton} onPress={handleReady}>
                        <LinearGradient
                            colors={['#FFD700', '#FFA500']}
                            style={styles.readyGradient}
                        >
                            <Text style={styles.readyButtonText}>准备</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ) : (
                    <>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.cardsScroll}
                        >
                            {myCards.map((card, idx) => (
                                <Card
                                    key={idx}
                                    card={card}
                                    selected={selectedCards.includes(card)}
                                    onPress={() => toggleCardSelection(card)}
                                />
                            ))}
                        </ScrollView>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[styles.actionButton, !isMyTurn() && styles.buttonDisabled]}
                                onPress={handlePlayCards}
                                disabled={!isMyTurn()}
                            >
                                <LinearGradient
                                    colors={['#C8102E', '#8B0000']}
                                    style={styles.actionGradient}
                                >
                                    <Text style={styles.actionButtonText}>出牌</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionButton, !isMyTurn() && styles.buttonDisabled]}
                                onPress={handlePass}
                                disabled={!isMyTurn()}
                            >
                                <View style={styles.passButton}>
                                    <Text style={styles.passButtonText}>不出</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    loadingText: {
        fontSize: theme.fontSizes.lg,
        color: theme.colors.textLight,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    backButton: {
        padding: theme.spacing.sm,
    },
    backButtonText: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.textLight,
    },
    roomId: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.textLight,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 60,
    },
    gameArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerArea: {
        alignItems: 'center',
    },
    lastPlayArea: {
        alignItems: 'center',
    },
    lastPlayLabel: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textDark,
        marginBottom: theme.spacing.sm,
    },
    lastPlayCards: {
        flexDirection: 'row',
    },
    cardType: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.secondary,
        marginTop: theme.spacing.sm,
        fontWeight: 'bold',
    },
    waitingArea: {
        alignItems: 'center',
    },
    waitingText: {
        fontSize: theme.fontSizes.lg,
        color: theme.colors.textLight,
        marginBottom: theme.spacing.sm,
    },
    waitingSubtext: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.textDark,
    },
    handArea: {
        padding: theme.spacing.md,
    },
    cardsScroll: {
        marginBottom: theme.spacing.md,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: theme.spacing.md,
    },
    actionButton: {
        flex: 1,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        ...theme.shadows.medium,
    },
    actionGradient: {
        paddingVertical: theme.spacing.md,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: theme.fontSizes.lg,
        fontWeight: 'bold',
        color: 'white',
    },
    passButton: {
        paddingVertical: theme.spacing.md,
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
    },
    passButtonText: {
        fontSize: theme.fontSizes.lg,
        color: theme.colors.text,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    readyButton: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        ...theme.shadows.medium,
    },
    readyGradient: {
        paddingVertical: theme.spacing.lg,
        alignItems: 'center',
    },
    readyButtonText: {
        fontSize: theme.fontSizes.xl,
        fontWeight: 'bold',
        color: theme.colors.background,
    },
});

export default GameScreen;
