import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import LobbyScreen from './src/screens/LobbyScreen';
import GameScreen from './src/screens/GameScreen';
import RoomWaitingScreen from './src/screens/RoomWaitingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import RecordsScreen from './src/screens/RecordsScreen';
import RulesScreen from './src/screens/RulesScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 主标签导航
const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#2C1810',
                    borderTopColor: '#4A3426',
                },
                tabBarActiveTintColor: '#FFD700',
                tabBarInactiveTintColor: '#999',
            }}
        >
            <Tab.Screen
                name="Lobby"
                component={LobbyScreen}
                options={{
                    tabBarLabel: '大厅',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
                }}
            />
            <Tab.Screen
                name="Records"
                component={RecordsScreen}
                options={{
                    tabBarLabel: '战绩',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📊</Text>,
                }}
            />
            <Tab.Screen
                name="Leaderboard"
                component={LeaderboardScreen}
                options={{
                    tabBarLabel: '排行榜',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏆</Text>,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: '我的',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
                }}
            />
        </Tab.Navigator>
    );
};

// 根导航
const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: '#2C1810' },
                }}
            >
                {/* 认证流程 */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />

                {/* 主应用 */}
                <Stack.Screen name="Main" component={MainTabs} />

                {/* 游戏流程 */}
                <Stack.Screen name="RoomWaiting" component={RoomWaitingScreen} />
                <Stack.Screen name="Game" component={GameScreen} />

                {/* 其他页面 */}
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="Rules" component={RulesScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
