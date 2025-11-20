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

const RecordsScreen = ({ navigation }) => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, won: 0, winRate: 0 });

    useEffect(() => {
        loadRecords();
    }, []);

    const loadRecords = async () => {
        try {
            // 这里应该调用实际的战绩API
            // const response = await api.get('/games/my-records');

            // 模拟数据
            const mockRecords = [
                {
                    _id: '1',
                    roomId: 'ROOM123456',
                    result: 'win',
                    score: 120,
                    players: ['玩家A', '玩家B', '玩家C'],
                    date: new Date().toISOString(),
                },
                {
                    _id: '2',
                    roomId: 'ROOM789012',
                    result: 'lose',
                    score: -50,
                    players: ['玩家D', '玩家E', '玩家F'],
                    date: new Date(Date.now() - 86400000).toISOString(),
                },
            ];

            setRecords(mockRecords);

            // 计算统计
            const total = mockRecords.length;
            const won = mockRecords.filter(r => r.result === 'win').length;
            setStats({
                total,
                won,
                winRate: total > 0 ? ((won / total) * 100).toFixed(1) : 0,
            });
        } catch (error) {
            console.error('加载战绩失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderRecord = ({ item }) => (
        <TouchableOpacity
            style={styles.recordCard}
            onPress={() => {
                // 打开战绩详情
            }}
        >
            <View style={styles.recordHeader}>
                <View
                    style={[
                        styles.resultBadge,
                        item.result === 'win' ? styles.winBadge : styles.loseBadge,
                    ]}
                >
                    <Text style={styles.resultText}>
                        {item.result === 'win' ? '胜' : '负'}
                    </Text>
                </View>
                <Text style={styles.roomId}>房间：{item.roomId}</Text>
            </View>

            <View style={styles.recordBody}>
                <Text style={styles.players}>
                    对手：{item.players.slice(1).join(', ')}
                </Text>
                <Text style={[
                    styles.score,
                    item.score > 0 ? styles.positiveScore : styles.negativeScore,
                ]}>
                    {item.score > 0 ? '+' : ''}{item.score}分
                </Text>
            </View>

            <Text style={styles.date}>
                {new Date(item.date).toLocaleString('zh-CN')}
            </Text>
        </TouchableOpacity>
    );

    return (
        <LinearGradient colors={['#2C1810', '#4A3426']} style={styles.container}>
            {/* 统计卡片 */}
            <View style={styles.statsCard}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{stats.total}</Text>
                    <Text style={styles.statLabel}>总局数</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{stats.won}</Text>
                    <Text style={styles.statLabel}>胜局</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{stats.winRate}%</Text>
                    <Text style={styles.statLabel}>胜率</Text>
                </View>
            </View>

            {/* 战绩列表 */}
            {loading ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>加载中...</Text>
                </View>
            ) : records.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📊</Text>
                    <Text style={styles.emptyText}>暂无战绩记录</Text>
                </View>
            ) : (
                <FlatList
                    data={records}
                    renderItem={renderRecord}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        margin: 15,
        borderRadius: 15,
        padding: 20,
        ...theme.shadows.medium,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    listContainer: {
        padding: 15,
    },
    recordCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        ...theme.shadows.small,
    },
    recordHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    resultBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    winBadge: {
        backgroundColor: '#4CAF50',
    },
    loseBadge: {
        backgroundColor: '#f44336',
    },
    resultText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    roomId: {
        fontSize: 14,
        color: '#666',
    },
    recordBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    players: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    score: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    positiveScore: {
        color: '#4CAF50',
    },
    negativeScore: {
        color: '#f44336',
    },
    date: {
        fontSize: 12,
        color: '#999',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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

export default RecordsScreen;
