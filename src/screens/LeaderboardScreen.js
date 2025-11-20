import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import api from '../services/api';
import { theme } from '../styles/theme';

const LeaderboardScreen = () => {
    const [tab, setTab] = useState('winRate'); // winRate, coins
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, [tab]);

    const loadLeaderboard = async () => {
        try {
            // 模拟数据
            const mockData = [
                { _id: '1', nickname: '高手玩家', winRate: 85.5, coins: 9850, rank: 1 },
                { _id: '2', nickname: '棋牌达人', winRate: 78.2, coins: 8530, rank: 2 },
                { _id: '3', nickname: '幸运星', winRate: 72.8, coins: 7200, rank: 3 },
                { _id: '4', nickname: '稳重哥', winRate: 68.5, coins: 6100, rank: 4 },
                { _id: '5', nickname: '快乐玩家', winRate: 65.3, coins: 5400, rank: 5 },
            ];

            // 根据选择的标签排序
            if (tab === 'coins') {
                mockData.sort((a, b) => b.coins - a.coins);
            }

            setLeaderboard(mockData);
        } catch (error) {
            console.error('加载排行榜失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankColor = (rank) => {
        switch (rank) {
            case 1:
                return theme.colors.gold;
            case 2:
                return '#C0C0C0'; // 银色
            case 3:
                return '#CD7F32'; // 铜色
            default:
                return '#666';
        }
    };

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return rank;
        }
    };

    const renderPlayer = ({ item }) => (
        <View style={styles.playerCard}>
            <View style={[styles.rankBadge, { backgroundColor: getRankColor(item.rank) }]}>
                <Text style={styles.rankText}>{getRankIcon(item.rank)}</Text>
            </View>

            <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{item.nickname}</Text>
                <Text style={styles.playerStat}>
                    {tab === 'winRate' ? `胜率 ${item.winRate}%` : `金币 ${item.coins}`}
                </Text>
            </View>

            <View style={styles.scoreContainer}>
                <Text style={styles.scoreValue}>
                    {tab === 'winRate' ? `${item.winRate}%` : item.coins}
                </Text>
            </View>
        </View>
    );

    return (
        <LinearGradient colors={['#2C1810', '#4A3426']} style={styles.container}>
            {/* 标签切换 */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, tab === 'winRate' && styles.activeTab]}
                    onPress={() => setTab('winRate')}
                >
                    <Text style={[styles.tabText, tab === 'winRate' && styles.activeTabText]}>
                        胜率榜
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, tab === 'coins' && styles.activeTab]}
                    onPress={() => setTab('coins')}
                >
                    <Text style={[styles.tabText, tab === 'coins' && styles.activeTabText]}>
                        财富榜
                    </Text>
                </TouchableOpacity>
            </View>

            {/* 排行榜列表 */}
            {loading ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>加载中...</Text>
                </View>
            ) : (
                <FlatList
                    data={leaderboard}
                    renderItem={renderPlayer}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={(
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyIcon}>🏆</Text>
                            <Text style={styles.emptyText}>暂无排行数据</Text>
                        </View>
                    )}
                />
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        margin: 15,
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 5,
        ...theme.shadows.medium,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: theme.colors.primary,
    },
    tabText: {
        fontSize: 16,
        color: '#666',
        fontWeight: 'bold',
    },
    activeTabText: {
        color: '#fff',
    },
    listContainer: {
        padding: 15,
    },
    playerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        ...theme.shadows.small,
    },
    rankBadge: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    rankText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    playerInfo: {
        flex: 1,
    },
    playerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    playerStat: {
        fontSize: 14,
        color: '#666',
    },
    scoreContainer: {
        alignItems: 'flex-end',
    },
    scoreValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
});

export default LeaderboardScreen;
