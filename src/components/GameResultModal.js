import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../styles/theme';

const GameResultModal = ({ visible, onClose, result, players, onPlayAgain }) => {
    if (!result) return null;

    const isWinner = result.winner === result.currentPlayerId;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <LinearGradient
                        colors={isWinner ? ['#FFD700', '#FFA500'] : ['#999', '#666']}
                        style={styles.gradient}
                    >
                        {/* 结果标题 */}
                        <Text style={styles.resultTitle}>
                            {isWinner ? '🎉 胜利！' : '😔 失败'}
                        </Text>

                        {/* 统计信息 */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>本局得分</Text>
                                <Text style={styles.statValue}>
                                    {isWinner ? '+' : ''}{result.score || 0}
                                </Text>
                            </View>

                            {result.roomCardChange && (
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>房卡变化</Text>
                                    <Text style={styles.statValue}>
                                        {result.roomCardChange > 0 ? '+' : ''}{result.roomCardChange}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* 玩家排名 */}
                        <View style={styles.playersContainer}>
                            <Text style={styles.playersTitle}>玩家排名</Text>
                            {players && players.map((player, index) => (
                                <View
                                    key={player.userId}
                                    style={[
                                        styles.playerRow,
                                        player.userId === result.currentPlayerId && styles.currentPlayer,
                                    ]}
                                >
                                    <Text style={styles.rank}>{index + 1}</Text>
                                    <Text style={styles.playerName}>{player.nickname}</Text>
                                    <Text style={styles.playerScore}>{player.score || 0}分</Text>
                                </View>
                            ))}
                        </View>

                        {/* 按钮组 */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.closeButton]}
                                onPress={onClose}
                            >
                                <Text style={styles.buttonText}>返回大厅</Text>
                            </TouchableOpacity>

                            {onPlayAgain && (
                                <TouchableOpacity
                                    style={[styles.button, styles.playAgainButton]}
                                    onPress={onPlayAgain}
                                >
                                    <Text style={styles.buttonText}>再来一局</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </LinearGradient>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '85%',
        maxHeight: '80%',
        borderRadius: 20,
        overflow: 'hidden',
    },
    gradient: {
        padding: 25,
    },
    resultTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 5,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    playersContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    playersTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    playerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    currentPlayer: {
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    rank: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        width: 30,
    },
    playerName: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
    },
    playerScore: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    playAgainButton: {
        backgroundColor: theme.colors.primary,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GameResultModal;
