import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { theme } from '../styles/theme';
import api from '../services/api';

const JoinRoomModal = ({ visible, onClose, onRoomJoined }) => {
    const [roomCode, setRoomCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        if (!roomCode || roomCode.length !== 6) {
            Alert.alert('提示', '请输入6位房间号');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post(`/rooms/join/${roomCode}`);
            Alert.alert('加入成功', `已加入房间：${roomCode}`);
            onRoomJoined(response.data.room);
            setRoomCode('');
            onClose();
        } catch (error) {
            Alert.alert('加入失败', error.response?.data?.message || '网络错误');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>🎲 加入房间</Text>

                    <Text style={styles.hint}>请输入6位房间号</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={roomCode}
                            onChangeText={(text) => setRoomCode(text.replace(/[^0-9]/g, ''))}
                            keyboardType="number-pad"
                            maxLength={6}
                            placeholder="000000"
                            placeholderTextColor="#ccc"
                            editable={!loading}
                        />
                    </View>

                    <View style={styles.numberPad}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <TouchableOpacity
                                key={num}
                                style={styles.numberButton}
                                onPress={() => {
                                    if (roomCode.length < 6) {
                                        setRoomCode(roomCode + num);
                                    }
                                }}
                                disabled={loading}
                            >
                                <Text style={styles.numberText}>{num}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={styles.numberButton}
                            onPress={() => setRoomCode('')}
                            disabled={loading}
                        >
                            <Text style={styles.numberText}>清空</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.numberButton}
                            onPress={() => {
                                if (roomCode.length < 6) {
                                    setRoomCode(roomCode + '0');
                                }
                            }}
                            disabled={loading}
                        >
                            <Text style={styles.numberText}>0</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.numberButton}
                            onPress={() => setRoomCode(roomCode.slice(0, -1))}
                            disabled={loading}
                        >
                            <Text style={styles.numberText}>删除</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>取消</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.joinButton,
                                roomCode.length !== 6 && styles.disabledButton,
                            ]}
                            onPress={handleJoin}
                            disabled={loading || roomCode.length !== 6}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.joinButtonText}>加入</Text>
                            )}
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
        width: '85%',
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
        marginBottom: 10,
    },
    hint: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.primary,
        textAlign: 'center',
        borderBottomWidth: 3,
        borderBottomColor: theme.colors.primary,
        paddingVertical: 10,
        letterSpacing: 8,
    },
    numberPad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    numberButton: {
        width: '30%',
        aspectRatio: 1.5,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    numberText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    buttonGroup: {
        flexDirection: 'row',
        marginTop: 10,
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
    joinButton: {
        backgroundColor: theme.colors.primary,
    },
    joinButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.5,
    },
});

export default JoinRoomModal;
