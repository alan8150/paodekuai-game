import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
    RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateRoomModal from '../components/CreateRoomModal';
import JoinRoomModal from '../components/JoinRoomModal';
import api from '../services/api';
import socketService from '../services/socket';
import { theme } from '../styles/theme';

const LobbyScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [myRooms, setMyRooms] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadUserData();
        loadMyRooms();
    }, []);

    const loadUserData = async () => {
        try {
            const response = await api.get('/auth/me');
            setUserData(response.data);
            await AsyncStorage.setItem('userData', JSON.stringify(response.data));
        } catch (error) {
            console.error('加载用户信息失败:', error);
        }
    };

    const loadMyRooms = async () => {
        try {
            const response = await api.get('/rooms/my/list');
            setMyRooms(response.data);
        } catch (error) {
            console.error('加载房间列表失败:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([loadUserData(), loadMyRooms()]);
        setRefreshing(false);
    };

    const handleRoomCreated = (room) => {
        navigation.navigate('RoomWaiting', { roomId: room._id });
    };

    const handleRoomJoined = (room) => {
        navigation.navigate('RoomWaiting', { roomId: room._id });
    };

    const enterRoom = (roomId) => {
        navigation.navigate('RoomWaiting', { roomId });
    };

    const logout = async () => {
        Alert.alert('确认', '确定要退出登录吗？', [
            { text: '取消', style: 'cancel' },
            {
                text: '退出',
                style: 'destructive',
                onPress: async () => {
                    await AsyncStorage.clear();
                    socketService.disconnect();
                    navigation.navigate('Login');
                },
            },
        ]);
    };

    const renderRoomCard = ({ item }) => (
        <TouchableOpacity
            style={styles.roomCard}
            onPress={() => enterRoom(item._id)}
        >
            <LinearGradient
                colors={['#4A3426', '#3D2817']}
                style={styles.roomGradient}
            >
                <View style={styles.roomHeader}>
                    <Text style={styles.roomCode}>房间号：{item.roomCode}</Text>
                    <View style={[
                        styles.statusBadge,
                        item.status === 'playing' && styles.statusBadgePlaying,
                    ]}>
                        <Text style={styles.statusText}>
                            {item.status === 'waiting' ? '等待中' : '游戏中'}
                        </Text>
                    </View>
                </View>

                <Text style={styles.roomName}>{item.roomName}</Text>

                <View style={styles.roomInfo}>
                    <Text style={styles.roomDetail}>
                        🎲 {item.totalRounds}局
                    </Text>
                    <Text style={styles.roomDetail}>
                        👥 {item.players.length}/{item.maxPlayers}
                    </Text>
                    <Text style={styles.roomDetail}>
                        💰 {item.baseScore}分/底
                    </Text>
                </View>

                {item.ownerId === userData?._id && (
                    <View style={styles.ownerBadge}>
                        <Text style={styles.ownerText}>👑 我的房间</Text>
                    </View>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <LinearGradient
            colors={['#2C1810', '#4A3426']}
            style={styles.container}
        >
            {/* 头部 */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>🎴 游戏大厅</Text>
                    <Text style={styles.welcome}>欢迎，{userData?.nickname || '玩家'}</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>退出</Text>
                </TouchableOpacity>
            </View>

            {/* 用户信息卡片（带房卡） */}
            <View style={styles.userCard}>
                <LinearGradient
                    colors={['#C8102E', '#8B0000']}
                    style={styles.userGradient}
                >
                    <View style={styles.userInfo}>
                        <Text style={styles.userLabel}>房卡</Text>
                        <Text style={styles.userValue}>🎴 {userData?.roomCards || 0}</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userLabel}>金币</Text>
                        <Text style={styles.userValue}>🪙 {userData?.coins || 0}</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userLabel}>场次</Text>
                        <Text style={styles.userValue}>{userData?.gamesPlayed || 0}局</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userLabel}>胜率</Text>
                        <Text style={styles.userValue}>
                            {userData?.gamesPlayed > 0
                                ? ((userData.gamesWon / userData.gamesPlayed) * 100).toFixed(1)
                                : 0}%
                        </Text>
                    </View>
                </LinearGradient>
            </View>

            {/* 操作按钮组 */}
            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.createButtonStyle]}
                    onPress={() => setShowCreateModal(true)}
                >
                    <LinearGradient
                        colors={['#FFD700', '#FFA500']}
                        style={styles.actionGradient}
                    >
                        <Text style={styles.actionButtonText}>🏠 创建房间</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.joinButtonStyle]}
                    onPress={() => setShowJoinModal(true)}
                >
                    <LinearGradient
                        colors={['#4CAF50', '#45a049']}
                        style={styles.actionGradient}
                    >
                        <Text style={styles.actionButtonText}>🎯 加入房间</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* 我的房间列表 */}
            <View style={styles.roomListContainer}>
                <Text style={styles.sectionTitle}>我的房间</Text>
                {myRooms.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>🏮</Text>
                        <Text style={styles.emptyText}>暂无房间</Text>
                        <Text style={styles.emptySubtext}>创建或加入一个房间开始游戏吧！</Text>
                    </View>
                ) : (
                    <FlatList
                        data={myRooms}
                        renderItem={renderRoomCard}
                        keyExtractor={(item) => item._id}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#fff"
                            />
                        }
                    />
                )}
            </View>

            {/* 创建房间弹窗 */}
            <CreateRoomModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onRoomCreated={handleRoomCreated}
                userCards={userData?.roomCards || 0}
            />

            {/* 加入房间弹窗 */}
            <JoinRoomModal
                visible={showJoinModal}
                onClose={() => setShowJoinModal(false)}
                onRoomJoined={handleRoomJoined}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    title: {
        fontSize: theme.fontSizes.xxl,
        fontWeight: 'bold',
        color: theme.colors.textLight,
    },
    welcome: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textDark,
        marginTop: 4,
    },
    logoutButton: {
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
    },
    logoutText: {
        color: theme.colors.text,
        fontSize: theme.fontSizes.sm,
    },
    userCard: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        marginBottom: theme.spacing.lg,
        ...theme.shadows.medium,
    },
    userGradient: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: theme.spacing.lg,
    },
    userInfo: {
        alignItems: 'center',
    },
    userLabel: {
        fontSize: theme.fontSizes.xs,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 4,
    },
    userValue: {
        fontSize: theme.fontSizes.md,
        fontWeight: 'bold',
        color: 'white',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        marginBottom: theme.spacing.lg,
        gap: 10,
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
        fontSize: theme.fontSizes.md,
        fontWeight: 'bold',
        color: '#fff',
    },
    roomListContainer: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: theme.fontSizes.lg,
        fontWeight: 'bold',
        color: theme.colors.textLight,
        marginBottom: theme.spacing.md,
    },
    roomCard: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        marginBottom: theme.spacing.md,
        ...theme.shadows.small,
    },
    roomGradient: {
        padding: theme.spacing.md,
    },
    roomHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
    },
    roomCode: {
        fontSize: theme.fontSizes.md,
        fontWeight: 'bold',
        color: theme.colors.gold,
    },
    statusBadge: {
        backgroundColor: theme.colors.secondary,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.sm,
    },
    statusBadgePlaying: {
        backgroundColor: '#4CAF50',
    },
    statusText: {
        fontSize: theme.fontSizes.xs,
        color: '#fff',
        fontWeight: 'bold',
    },
    roomName: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.textLight,
        marginBottom: theme.spacing.sm,
    },
    roomInfo: {
        flexDirection: 'row',
        gap: 15,
    },
    roomDetail: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textDark,
    },
    ownerBadge: {
        marginTop: theme.spacing.sm,
        backgroundColor: theme.colors.gold + '30',
        alignSelf: 'flex-start',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
    },
    ownerText: {
        fontSize: theme.fontSizes.xs,
        color: theme.colors.gold,
        fontWeight: 'bold',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: theme.fontSizes.xxl,
        color: theme.colors.textDark,
        marginBottom: theme.spacing.sm,
    },
    emptySubtext: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.textDark,
    },
});

export default LobbyScreen;
