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
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { authAPI } from '../services/api';
import { theme } from '../styles/theme';

const RegisterScreen = ({ navigation }) => {
    const [registerType, setRegisterType] = useState('phone'); // 'phone' or 'email'
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert('提示', '两次输入的密码不一致');
            return;
        }

        if (password.length < 6) {
            Alert.alert('提示', '密码至少6位');
            return;
        }

        setLoading(true);
        try {
            let response;
            if (registerType === 'phone') {
                if (!phone) {
                    Alert.alert('提示', '请输入手机号');
                    return;
                }
                response = await authAPI.registerByPhone(phone, password, nickname);
            } else {
                if (!email) {
                    Alert.alert('提示', '请输入邮箱');
                    return;
                }
                response = await authAPI.registerByEmail(email, password, nickname);
            }

            if (response.success) {
                Alert.alert('注册成功', '请返回登录', [
                    { text: '确定', onPress: () => navigation.goBack() },
                ]);
            }
        } catch (error) {
            Alert.alert('注册失败', error);
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* 标题 */}
                    <View style={styles.header}>
                        <Text style={styles.title}>注册账号</Text>
                        <Text style={styles.subtitle}>加入跑得快游戏</Text>
                    </View>

                    {/* 注册方式选择 */}
                    <View style={styles.typeSelector}>
                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                registerType === 'phone' && styles.typeButtonActive,
                            ]}
                            onPress={() => setRegisterType('phone')}
                        >
                            <Text
                                style={[
                                    styles.typeText,
                                    registerType === 'phone' && styles.typeTextActive,
                                ]}
                            >
                                手机号注册
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.typeButton,
                                registerType === 'email' && styles.typeButtonActive,
                            ]}
                            onPress={() => setRegisterType('email')}
                        >
                            <Text
                                style={[
                                    styles.typeText,
                                    registerType === 'email' && styles.typeTextActive,
                                ]}
                            >
                                邮箱注册
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* 注册表单 */}
                    <View style={styles.form}>
                        {registerType === 'phone' ? (
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>手机号</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="请输入手机号"
                                    placeholderTextColor={theme.colors.textDark}
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        ) : (
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>邮箱</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="请输入邮箱"
                                    placeholderTextColor={theme.colors.textDark}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        )}

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>昵称（可选）</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="设置游戏昵称"
                                placeholderTextColor={theme.colors.textDark}
                                value={nickname}
                                onChangeText={setNickname}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>密码</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="至少6位密码"
                                placeholderTextColor={theme.colors.textDark}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>确认密码</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="再次输入密码"
                                placeholderTextColor={theme.colors.textDark}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={['#C8102E', '#8B0000']}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.buttonText}>
                                    {loading ? '注册中...' : '注册'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.loginLink}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.loginText}>
                                已有账号？<Text style={styles.loginTextBold}>立即登录</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.spacing.xl * 2,
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
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
    typeSelector: {
        flexDirection: 'row',
        marginBottom: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.surface,
        padding: 4,
    },
    typeButton: {
        flex: 1,
        paddingVertical: theme.spacing.sm,
        alignItems: 'center',
        borderRadius: theme.borderRadius.md,
    },
    typeButtonActive: {
        backgroundColor: theme.colors.primary,
    },
    typeText: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.textDark,
    },
    typeTextActive: {
        color: 'white',
        fontWeight: 'bold',
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
    loginLink: {
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
        alignItems: 'center',
    },
    loginText: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.text,
    },
    loginTextBold: {
        color: theme.colors.secondary,
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
