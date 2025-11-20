import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { theme } from '../styles/theme';
import api from '../services/api';

const CreateRoomModal = ({ visible, onClose, onRoomCreated, userCards }) => {
    const [roomName, setRoomName] = useState('');
    const [totalRounds, setTotalRounds] = useState(8);
    const [maxPlayers, setMaxPlayers] = useState(3);
    const [baseScore, setBaseScore] = useState(1);
    const [rules, setRules] = useState({
        allowBomb: true,
        allowTriplePair: true,
        firstPlayerOutSingle3: true,
        springDouble: true,
    });
    const [loading, setLoading] = useState(false);

    const cardCost = totalRounds === 4 ? 1 : totalRounds === 8 ? 2 : 3;

    const handleCreate = async () => {
        if (userCards < cardCost) {
            Alert.alert('房卡不足', `需要${cardCost}张房卡，当前剩余${userCards}张`);
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/rooms/create', {
                roomName: roomName || '我的房间',
                totalRounds,
                maxPlayers,
                baseScore,
                rules,
            });

            Alert.alert('创建成功', `房间号：${response.data.room.roomCode}`);
            onRoomCreated(response.data.room);
            onClose();
        } catch (error) {
            Alert.alert('创建失败', error.response?.data?.message || '网络错误');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>🏮 创建房间</Text>

                    <ScrollView style={styles.formContainer}>
                        {/* 房间名称 */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>房间名称</Text>
                            <TextInput
                                style={styles.input}
                                value={roomName}
                                onChangeText={setRoomName}
                                placeholder="输入房间名称"
                                placeholderTextColor="#999"
                            />
                        </View>

                        {/* 游戏局数 */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>游戏局数</Text>
                            <View style={styles.optionGroup}>
                                {[4, 8, 16].map((rounds) => (
                                    <TouchableOpacity
                                        key={rounds}
                                        style={[
                                            styles.optionButton,
                                            totalRounds === rounds && styles.optionButtonActive,
                                        ]}
                                        onPress={() => setTotalRounds(rounds)}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                totalRounds === rounds && styles.optionTextActive,
                                            ]}
                                        >
                                            {rounds}局
                                        </Text>
                                        <Text style={styles.cardCostText}>
                                            ({rounds === 4 ? 1 : rounds === 8 ? 2 : 3}卡)
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* 玩家人数 */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>玩家人数</Text>
                            <View style={styles.optionGroup}>
                                {[2, 3, 4].map((num) => (
                                    <TouchableOpacity
                                        key={num}
                                        style={[
                                            styles.optionButton,
                                            maxPlayers === num && styles.optionButtonActive,
                                        ]}
                                        onPress={() => setMaxPlayers(num)}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                maxPlayers === num && styles.optionTextActive,
                                            ]}
                                        >
                                            {num}人
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* 底分设置 */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>底分</Text>
                            <View style={styles.optionGroup}>
                                {[1, 2, 5].map((score) => (
                                    <TouchableOpacity
                                        key={score}
                                        style={[
                                            styles.optionButton,
                                            baseScore === score && styles.optionButtonActive,
                                        ]}
                                        onPress={() => setBaseScore(score)}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                baseScore === score && styles.optionTextActive,
                                            ]}
                                        >
                                            {score}分
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* 玩法规则 */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>玩法规则</Text>
                            <View style={styles.rulesContainer}>
                                {Object.entries({
                                    allowBomb: '允许炸弹',
                                    allowTriplePair: '允许三连对',
                                    firstPlayerOutSingle3: '首家出单3',
                                    springDouble: '春天加倍',
                                }).map(([key, label]) => (
                                    <TouchableOpacity
                                        key={key}
                                        style={styles.ruleItem}
                                        onPress={() => setRules({ ...rules, [key]: !rules[key] })}
                                    >
                                        <View
                                            style={[
                                                styles.checkbox,
                                                rules[key] && styles.checkboxActive,
                                            ]}
                                        >
                                            {rules[key] && <Text style={styles.checkmark}>✓</Text>}
                                        </View>
                                        <Text style={styles.ruleLabel}>{label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* 消耗提示 */}
                        <View style={styles.costInfo}>
                            <Text style={styles.costText}>
                                💳 消耗房卡：{cardCost}张
                            </Text>
                            <Text style={styles.remainingText}>
                                剩余：{userCards}张
                            </Text>
                        </View>
                    </ScrollView>

                    {/* 按钮组 */}
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>取消</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.createButton]}
                            onPress={handleCreate}
                            disabled={loading}
                        >
                            <Text style={styles.createButtonText}>
                                {loading ? '创建中...' : '创建房间'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        ...theme.shadows.large,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
        textAlign: 'center',
        marginBottom: 20,
    },
    formContainer: {
        maxHeight: 400,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    input: {
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
    },
    optionGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    optionButton: {
        flex: 1,
        padding: 12,
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderRadius: 10,
        alignItems: 'center',
    },
    optionButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    optionTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cardCostText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    rulesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        marginBottom: 10,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    checkmark: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    ruleLabel: {
        fontSize: 14,
        color: '#333',
    },
    costInfo: {
        backgroundColor: theme.colors.gold + '20',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
    },
    costText: {
        fontSize: 16,
        color: theme.colors.gold,
        fontWeight: 'bold',
    },
    remainingText: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    buttonGroup: {
        flexDirection: 'row',
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: 'bold',
    },
    createButton: {
        backgroundColor: theme.colors.primary,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CreateRoomModal;
