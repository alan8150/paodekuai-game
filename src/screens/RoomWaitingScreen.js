import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
    Image,
} from 'react-native';
import { theme } from '../styles/theme';
import socketService from '../services/socket';
import api from '../services/api';

const RoomWaitingScreen = ({ route, navigation }) => {
    const { roomId } = route.params;
    const [room, setRoom] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRoomData();
        setupSocketListeners();

        return () => {
            socketService.socket?.off('player-joined');
            socketService.socket?.off('player-left');
            socketService.socket?.off('game-started');
            socketService.socket?.off('room-dismissed');
        };
    }, []);

    const loadRoomData = async () => {
        try {
            const response = await api.get(`/rooms/${roomId}`);
            setRoom(response.data);
            // 获取当前用户信息
            const userResponse = await api.get('/auth/me');
            setCurrentUser(userResponse.data);
        } catch (error) {
            Alert.alert('错误', '加载房间信息失败');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const setupSocketListeners = () => {
        socketService.socket?.on('player-joined', (data) => {
            setRoom((prev) => ({ ...prev, players: data.players }));
        });

        socketService.socket?.on('player-left', (data) => {
            setRoom((prev) => ({ ...prev, players: data.players }));
        });

        socketService.socket?.on('game-started', () => {
            navigation.replace('Game', { roomId });
        });

        socketService.socket?.on('room-dismissed', () => {
            Alert.alert('提示', '房主已解散房间', [
                { text: '确定', onPress: () => navigation.goBack() },
            ]);
        });
    };

    const handleStartGame = () => {
        if (room.players.length < 2) {
            Alert.alert('提示', '至少需要2名玩家才能开始游戏');
            return;
        }

        socketService.emit('start-game', { roomId });
    };

    const handleLeaveRoom = async () => {
        Alert.alert('确认', '确定要离开房间吗？', [
            { text: '取消', style: 'cancel' },
            {
                text: '离开',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.post(`/rooms/${room._id}/leave`);
                        navigation.goBack();
                    } catch (error) {
                        Alert.alert('错误', '离开房间失败');
                    }
                },
            },
        ]);
    };

    const handleDismissRoom = () => {
        Alert.alert('确认', '确定要解散房间吗？', [
            { text: '取消', style: 'cancel' },
            {
                text: '解散',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.post(`/rooms/${room._id}/dismiss`);
                        navigation.goBack();
                    } catch (error) {
                        Alert.alert('错误', '解散房间失败');
                    }
                },
            },
        ]);
    };

    const handleKickPlayer = (playerId) => {
        Alert.alert('确认', '确定要踢出该玩家吗？', [
            { text: '取消', style: 'cancel' },
            {
                text: '踢出',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.post(`/rooms/${room._id}/kick/${playerId}`);
                    } catch (error) {
                        Alert.alert('错误', '踢出玩家失败');
                    }
                },
            },
        ]);
    };

    if (loading || !room) {
        return (
            <View style={styles.container}>
                <Text>加载中...</Text>
            </View>
        );
    }

    const isOwner = currentUser && room.ownerId === currentUser._id;

    return (
        <View style={styles.container}>
            {/* 房间信息 */}
            <View style={styles.roomInfo}>
                <Text style={styles.roomCode}>房间号：{room.roomCode}</Text>
                <Text style={styles.roomName}>{room.roomName}</Text>
                <View style={styles.roomSettings}>
                    <Text style={styles.settingText}>
                        🎲 {room.totalRounds}局 · 👥 {room.maxPlayers}人 · 💰 {room.baseScore}分/底
                    </Text>
                </View>
            </View>

            {/* 玩家列表 */}
            <View style={styles.playersContainer}>
                <Text style={styles.sectionTitle}>
                    玩家列表 ({room.players.length}/{room.maxPlayers})
                </Text>
                <FlatList
                    data={room.players}
                    keyExtractor={(item) => item.userId}
                    renderItem={({ item }) => (
                        <View style={styles.playerCard}>
                            <Image
                                source={{ uri: item.avatar }}
                                style={styles.avatar}
                            />
                            <View style={styles.playerInfo}>
                                <Text style={styles.playerName}>
                                    {item.nickname}
                                    {item.userId === room.ownerId && (
                                        <Text style={styles.ownerBadge}> 👑房主</Text>
                                    )}
                                </Text>
                                <Text style={styles.playerStatus}>
                                    {item.isReady ? '✅ 已准备' : '⏳ 等待中'}
                                </Text>
                            </View>
                            {isOwner && item.userId !== currentUser._id && (
                                <TouchableOpacity
                                    style={styles.kickButton}
                                    onPress={() => handleKickPlayer(item.userId)}
                                >
                                    <Text style={styles.kickButtonText}>踢出</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                />
            </View>

            {/* 规则显示 */}
            <View style={styles.rulesContainer}>
                <Text style={styles.rulesTitle}>玩法规则：</Text>
                <View style={styles.rulesTags}>
                    {room.rules.allowBomb && <Text style={styles.ruleTag}>炸弹</Text>}
                    {room.rules.allowTriplePair && <Text style={styles.ruleTag}>三连对</Text>}
                    {room.rules.firstPlayerOutSingle3 && <Text style={styles.ruleTag}>首出单3</Text>}
                    {room.rules.springDouble && <Text style={styles.ruleTag}>春天加倍</Text>}
                </View>
            </View>

            {/* 操作按钮 */}
            <View style={styles.buttonContainer}>
                {isOwner ? (
                    <>
                        <TouchableOpacity
                            style={[styles.button, styles.dismissButton]}
                            onPress={handleDismissRoom}
                        >
                            <Text style={styles.buttonText}>解散房间</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.startButton]}
                            onPress={handleStartGame}
                        >
                            <Text style={styles.buttonText}>开始游戏</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity
                        style={[styles.button, styles.leaveButton]}
                        onPress={handleLeaveRoom}
                    >
                        <Text style={styles.buttonText}>离开房间</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    roomInfo: {
        backgroundColor: theme.colors.primary,
        padding: 20,
        alignItems: 'center',
    },
    roomCode: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    roomName: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 10,
    },
    roomSettings: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        borderRadius: 10,
    },
    settingText: {
        color: '#fff',
        fontSize: 14,
    },
    playersContainer: {
        flex: 1,
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    playerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        ...theme.shadows.medium,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    playerInfo: {
        flex: 1,
    },
    playerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    ownerBadge: {
        color: theme.colors.gold,
        fontSize: 14,
    },
    playerStatus: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    kickButton: {
        backgroundColor: '#ff4444',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
    },
    kickButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    rulesContainer: {
        padding: 15,
        backgroundColor: '#f5f5f5',
    },
    rulesTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    rulesTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    ruleTag: {
        backgroundColor: theme.colors.primary + '20',
        color: theme.colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginRight: 10,
        marginBottom: 5,
        fontSize: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#fff',
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    startButton: {
        backgroundColor: theme.colors.primary,
    },
    dismissButton: {
        backgroundColor: '#ff4444',
    },
    leaveButton: {
        backgroundColor: '#999',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default RoomWaitingScreen;
