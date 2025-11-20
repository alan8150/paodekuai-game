import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';
import socketService from '../services/socket';
import { theme } from '../styles/theme';

const LoginScreen = ({ navigation }) => {
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!account || !password) {
            Alert.alert('提示', '请输入账号和密码');
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.login(account, password);

            if (response.success) {
                const { token, ...userData } = response.data;

                // 保存token和用户信息
                await AsyncStorage.setItem('userToken', token);
                await AsyncStorage.setItem('userData', JSON.stringify(userData));

                // 连接Socket
                socketService.connect(token);

                // 跳转到大厅
                navigation.replace('Lobby');
            }
        } catch (error) {
            Alert.alert('登录失败', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#2C1810', '#4A3426']}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                {/* logo和标题 */}
                <View style={styles.header}>
                    <Text style={styles.logo}>🎴</Text>
                    <Text style={styles.title}>跑得快</Text>
                    <Text style={styles.subtitle}>中国风棋牌游戏</Text>
                </View>

                {/* 登录表单 */}
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>账号</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="手机号或邮箱"
                            placeholderTextColor={theme.colors.textDark}
                            value={account}
                            onChangeText={setAccount}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>密码</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="请输入密码"
                            placeholderTextColor={theme.colors.textDark}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <LinearGradient
                            colors={['#C8102E', '#8B0000']}
                            style={styles.buttonGradient}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? '登录中...' : '登录'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.registerLink}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.registerText}>
                            还没有账号？<Text style={styles.registerTextBold}>立即注册</Text>
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* 装饰元素 */}
                <View style={styles.decoration}>
                    <Text style={styles.decorationText}>🏮</Text>
                    <Text style={styles.decorationText}>🏮</Text>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl * 2,
    },
    logo: {
        fontSize: 80,
        marginBottom: theme.spacing.md,
    },
    title: {
        fontSize: theme.fontSizes.xxl,
        fontWeight: 'bold',
        color: theme.colors.textLight,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.textDark,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: theme.spacing.lg,
    },
    label: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
        fontWeight: '600',
    },
    input: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        fontSize: theme.fontSizes.md,
        color: theme.colors.textLight,
        borderWidth: 2,
        borderColor: theme.colors.secondary + '40',
    },
    button: {
        marginTop: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        ...theme.shadows.medium,
    },
    buttonGradient: {
        paddingVertical: theme.spacing.md,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: theme.fontSizes.lg,
        fontWeight: 'bold',
        color: 'white',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    registerLink: {
        marginTop: theme.spacing.lg,
        alignItems: 'center',
    },
    registerText: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.text,
    },
    registerTextBold: {
        color: theme.colors.secondary,
        fontWeight: 'bold',
    },
    decoration: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.xl,
    },
    decorationText: {
        fontSize: 40,
        marginHorizontal: theme.spacing.md,
    },
});

export default LoginScreen;
