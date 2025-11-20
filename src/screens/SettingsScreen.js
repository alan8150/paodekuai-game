import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Switch,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../styles/theme';

const SettingsScreen = ({ navigation }) => {
    const [settings, setSettings] = useState({
        soundEnabled: true,
        musicEnabled: true,
        vibrationEnabled: true,
        notificationsEnabled: true,
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const saved = await AsyncStorage.getItem('settings');
            if (saved) {
                setSettings(JSON.parse(saved));
            }
        } catch (error) {
            console.error('加载设置失败:', error);
        }
    };

    const updateSetting = async (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
    };

    const handleClearCache = () => {
        Alert.alert('清除缓存', '确定要清除缓存吗？', [
            { text: '取消', style: 'cancel' },
            {
                text: '确定',
                onPress: async () => {
                    // 清除缓存逻辑
                    Alert.alert('成功', '缓存已清除');
                },
            },
        ]);
    };

    return (
        <LinearGradient colors={['#2C1810', '#4A3426']} style={styles.container}>
            <ScrollView>
                {/* 声音和音效 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>声音设置</Text>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>🔊 音效</Text>
                        <Switch
                            value={settings.soundEnabled}
                            onValueChange={(value) => updateSetting('soundEnabled', value)}
                            trackColor={{ false: '#ccc', true: theme.colors.primary }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>🎵 背景音乐</Text>
                        <Switch
                            value={settings.musicEnabled}
                            onValueChange={(value) => updateSetting('musicEnabled', value)}
                            trackColor={{ false: '#ccc', true: theme.colors.primary }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>📳 震动</Text>
                        <Switch
                            value={settings.vibrationEnabled}
                            onValueChange={(value) => updateSetting('vibrationEnabled', value)}
                            trackColor={{ false: '#ccc', true: theme.colors.primary }}
                        />
                    </View>
                </View>

                {/* 通知设置 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>通知设置</Text>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>🔔 推送通知</Text>
                        <Switch
                            value={settings.notificationsEnabled}
                            onValueChange={(value) => updateSetting('notificationsEnabled', value)}
                            trackColor={{ false: '#ccc', true: theme.colors.primary }}
                        />
                    </View>
                </View>

                {/* 其他设置 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>其他</Text>

                    <TouchableOpacity style={styles.actionItem} onPress={handleClearCache}>
                        <Text style={styles.actionLabel}>🗑️ 清除缓存</Text>
                        <Text style={styles.actionArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionItem}
                        onPress={() => navigation.navigate('Rules')}
                    >
                        <Text style={styles.actionLabel}>📖 游戏规则</Text>
                        <Text style={styles.actionArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionItem}
                        onPress={() => Alert.alert('关于我们', '跑得快棋牌游戏\n版本 1.0.0')}
                    >
                        <Text style={styles.actionLabel}>ℹ️ 关于我们</Text>
                        <Text style={styles.actionArrow}>›</Text>
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
    section: {
        margin: 15,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 5,
        ...theme.shadows.medium,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        padding: 15,
        paddingBottom: 5,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingLabel: {
        fontSize: 16,
        color: '#333',
    },
    actionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    actionLabel: {
        fontSize: 16,
        color: '#333',
    },
    actionArrow: {
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

export default SettingsScreen;
