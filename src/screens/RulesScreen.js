import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../styles/theme';

const RulesScreen = () => {
    return (
        <LinearGradient colors={['#2C1810', '#4A3426']} style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* 基本规则 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📖 基本规则</Text>
                    <View style={styles.card}>
                        <Text style={styles.text}>
                            跑得快是一种流行的扑克牌游戏，使用一副牌去掉大小王，共52张牌。
                        </Text>
                        <Text style={styles.text}>
                            3-4名玩家，目标是最快将手中的牌全部打完。
                        </Text>
                        <Text style={styles.text}>
                            先出完牌的玩家获胜，最后出完的玩家失败。
                        </Text>
                    </View>
                </View>

                {/* 牌型说明 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🎴 牌型说明</Text>
                    <View style={styles.card}>
                        <View style={styles.ruleItem}>
                            <Text style={styles.ruleTitle}>单牌</Text>
                            <Text style={styles.ruleDesc}>单张牌，如：3、K、A等</Text>
                        </View>

                        <View style={styles.ruleItem}>
                            <Text style={styles.ruleTitle}>对子</Text>
                            <Text style={styles.ruleDesc}>两张点数相同的牌，如：33、KK等</Text>
                        </View>

                        <View style={styles.ruleItem}>
                            <Text style={styles.ruleTitle}>三张</Text>
                            <Text style={styles.ruleDesc}>三张点数相同的牌，如：333、KKK等</Text>
                        </View>

                        <View style={styles.ruleItem}>
                            <Text style={styles.ruleTitle}>顺子</Text>
                            <Text style={styles.ruleDesc}>
                                五张或以上连续的牌，如：34567等（最小3，最大A）
                            </Text>
                        </View>

                        <View style={styles.ruleItem}>
                            <Text style={styles.ruleTitle}>连对</Text>
                            <Text style={styles.ruleDesc}>
                                三对或以上连续的对子，如：334455等
                            </Text>
                        </View>

                        <View style={styles.ruleItem}>
                            <Text style={styles.ruleTitle}>三连对</Text>
                            <Text style={styles.ruleDesc}>
                                三组或以上连续的三张，如：333444555等
                            </Text>
                        </View>

                        <View style={styles.ruleItem}>
                            <Text style={styles.ruleTitle}>炸弹</Text>
                            <Text style={styles.ruleDesc}>
                                四张点数相同的牌，可压任何牌型（除了更大的炸弹）
                            </Text>
                        </View>
                    </View>
                </View>

                {/* 出牌规则 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚡ 出牌规则</Text>
                    <View style={styles.card}>
                        <Text style={styles.text}>
                            1. 首局由持有红桃3的玩家先出牌，且必须包含红桃3
                        </Text>
                        <Text style={styles.text}>
                            2. 之后每局由上局获胜者先出牌
                        </Text>
                        <Text style={styles.text}>
                            3. 其他玩家按顺时针方向依次出牌
                        </Text>
                        <Text style={styles.text}>
                            4. 必须出比上家更大的同类型牌，或选择"过"
                        </Text>
                        <Text style={styles.text}>
                            5. 所有玩家都"过"后，最后出牌的玩家可出任意牌型
                        </Text>
                        <Text style={styles.text}>
                            6. 炸弹可以压任何牌型（更大的炸弹除外）
                        </Text>
                    </View>
                </View>

                {/* 牌型大小 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📊 牌型大小</Text>
                    <View style={styles.card}>
                        <Text style={styles.text}>
                            点数大小：3 &lt; 4 &lt; 5 &lt; 6 &lt; 7 &lt; 8 &lt; 9 &lt; 10 &lt; J &lt; Q &lt; K &lt; A &lt; 2
                        </Text>
                        <Text style={styles.text}>
                            花色大小：黑桃 &gt; 红桃 &gt; 梅花 &gt; 方块
                        </Text>
                        <Text style={styles.text}>
                            炸弹大小：点数大 &gt; 点数小
                        </Text>
                    </View>
                </View>

                {/* 特殊规则 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⭐ 特殊规则</Text>
                    <View style={styles.card}>
                        <Text style={styles.text}>
                            <Text style={styles.boldText}>春天：</Text>
                            如果有玩家一张牌都没出就输了，算春天，分数翻倍
                        </Text>
                        <Text style={styles.text}>
                            <Text style={styles.boldText}>炸弹加倍：</Text>
                            打出炸弹后，本局分数翻倍
                        </Text>
                    </View>
                </View>

                {/* 计分规则 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>💰 计分规则</Text>
                    <View style={styles.card}>
                        <Text style={styles.text}>
                            第一名：+基础分 × 倍率
                        </Text>
                        <Text style={styles.text}>
                            第二名：0分
                        </Text>
                        <Text style={styles.text}>
                            第三名：-基础分 × 倍率
                        </Text>
                        <Text style={styles.text}>
                            倍率 = 炸弹数 × 春天加倍
                        </Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>祝您游戏愉快！🎉</Text>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        marginTop: 15,
        marginHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        ...theme.shadows.medium,
    },
    text: {
        fontSize: 15,
        color: '#333',
        lineHeight: 24,
        marginBottom: 8,
    },
    boldText: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    ruleItem: {
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    ruleTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 5,
    },
    ruleDesc: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    footer: {
        padding: 30,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default RulesScreen;
