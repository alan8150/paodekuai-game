import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { theme } from '../styles/theme';

const ProfileScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [editing, setEditing] = useState(false);
    const [nickname, setNickname] = useState('');

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const response = await api.get('/auth/me');
            setUserData(response.data);
            setNickname(response.data.nickname);
        } catch (error) {
            console.error('加载用户信息失败:', error);
        }
    };

    const handleUpdateNickname = async () => {
        if (!nickname || nickname.trim().length === 0) {
            Alert.alert('提示', '昵称不能为空');
            return;
        }

        try {
            await api.put('/auth/profile', { nickname });
            setEditing(false);
            loadUserData();
            Alert.alert('成功', '昵称已更新');
        } catch (error) {
            Alert.alert('错误', '更新失败');
        }
    };

    const handleLogout = () => {
        Alert.alert('确认', '确定要退出登录吗？', [
            { text: '取消', style: 'cancel' },
            {
                text: '退出',
                style: 'destructive',
                onPress: async () => {
                    await AsyncStorage.clear();
                    navigation.replace('Login');
                },
            },
        ]);
    };

    if (!userData) {
        return (
            <View style={styles.container}>
                <Text>加载中...</Text>
            </View>
        );
    }

    return (
        <LinearGradient colors={['#2C1810', '#4A3426']} style={styles.container}>
            <ScrollView>
                {/* 头部信息 */}
                <View style={styles.header}>
                    <Image
                        source={{ uri: userData.avatar || 'https://via.placeholder.com/150' }}
                        style={styles.avatar}
                    />
                    {editing ? (
                        <View style={styles.editContainer}>
                            <TextInput
                                style={styles.nicknameInput}
                                value={nickname}
                                onChangeText={setNickname}
                                placeholder="输入昵称"
                                placeholderTextColor="#999"
                            />
                            <View style={styles.editButtons}>
                                <TouchableOpacity
                                    style={[styles.editButton, styles.cancelButton]}
                                    onPress={() => {
                                        setEditing(false);
                                        setNickname(userData.nickname);
                                    }}
                                >
                                    <Text style={styles.buttonText}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.editButton, styles.saveButton]}
                                    onPress={handleUpdateNickname}
                                >
                                    <Text style={styles.buttonText}>保存</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.userInfo}>
                            <Text style={styles.nickname}>{userData.nickname}</Text>
                            <TouchableOpacity onPress={() => setEditing(true)}>
                                <Text style={styles.editText}>✏️ 修改昵称</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {userData.vipLevel > 0 && (
                        <View style={styles.vipBadge}>
                            <Text style={styles.vipText}>VIP {userData.vipLevel}</Text>
                        </View>
                    )}
                </View>

                {/* 资产信息 */}
                <View style={styles.assetsContainer}>
                    <View style={styles.assetCard}>
                        <Text style={styles.assetLabel}>房卡</Text>
                        <Text style={styles.assetValue}>🎴 {userData.roomCards}</Text>
                        <TouchableOpacity style={styles.rechargeButton}>
                            <Text style={styles.rechargeText}>充值</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.assetCard}>
                        <Text style={styles.assetLabel}>金币</Text>
                        <Text style={styles.assetValue}>🪙 {userData.coins}</Text>
                        <TouchableOpacity style={styles.rechargeButton}>
                            <Text style={styles.rechargeText}>充值</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 游戏统计 */}
                <View style={styles.statsContainer}>
                    <Text style={styles.sectionTitle}>游戏统计</Text>

                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>总局数</Text>
                        <Text style={styles.statValue}>{userData.gamesPlayed}</Text>
                    </View>

                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>胜局数</Text>
                        <Text style={styles.statValue}>{userData.gamesWon}</Text>
                    </View>

                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>胜率</Text>
                        <Text style={styles.statValue}>
                            {userData.gamesPlayed > 0
                                ? ((userData.gamesWon / userData.gamesPlayed) * 100).toFixed(1)
                                : 0}%
                        </Text>
                    </View>

                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>创建房间数</Text>
                        <Text style={styles.statValue}>{userData.totalRoomsCreated || 0}</Text>
                    </View>
                </View>

                {/* 功能菜单 */}
                <View style={styles.menuContainer}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Records')}
                    >
                        <Text style={styles.menuIcon}>📊</Text>
                        <Text style={styles.menuText}>战绩查询</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Text style={styles.menuIcon}>⚙️</Text>
                        <Text style={styles.menuText}>设置</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Rules')}
                    >
                        <Text style={styles.menuIcon}>📖</Text>
                        <Text style={styles.menuText}>游戏规则</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                        <Text style={styles.menuIcon}>🚪</Text>
                        <Text style={styles.menuText}>退出登录</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* 版本信息 */}
                <Text style={styles.version}>版本 1.0.0</Text>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        padding: 30,
        paddingTop: 50,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: theme.colors.gold,
    },
    userInfo: {
        alignItems: 'center',
        marginTop: 15,
    },
    nickname: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    editText: {
        color: theme.colors.gold,
        fontSize: 14,
    },
    editContainer: {
        width: '100%',
        marginTop: 15,
    },
    nicknameInput: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        textAlign: 'center',
    },
    editButtons: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 10,
    },
    editButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#999',
    },
    saveButton: {
        backgroundColor: theme.colors.primary,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    vipBadge: {
        backgroundColor: theme.colors.gold,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 15,
        marginTop: 10,
    },
    vipText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    assetsContainer: {
        flexDirection: 'row',
        padding: 15,
        gap: 15,
    },
    assetCard: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        ...theme.shadows.medium,
    },
    assetLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    assetValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 10,
    },
    rechargeButton: {
        backgroundColor: theme.colors.gold,
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 15,
    },
    rechargeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    statsContainer: {
        margin: 15,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    statLabel: {
        fontSize: 16,
        color: '#666',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    menuContainer: {
        margin: 15,
        backgroundColor: 'white',
        borderRadius: 15,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuIcon: {
        fontSize: 24,
        marginRight: 15,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    menuArrow: {
        fontSize: 24,
        color: '#ccc',
    },
    version: {
        textAlign: 'center',
        color: '#999',
        fontSize: 12,
        paddingVertical: 20,
    },
});

export default ProfileScreen;
