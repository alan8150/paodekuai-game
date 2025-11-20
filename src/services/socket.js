import io from 'socket.io-client';

const SOCKET_URL = 'http://192.168.1.100:3000';

class SocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    // 连接Socket
    connect(token) {
        if (this.socket) {
            return;
        }

        this.socket = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket connected');
            // 发送认证
            this.emit('authenticate', token);
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    }

    // 断开连接
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.listeners.clear();
        }
    }

    // 发送事件
    emit(event, data) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    // 监听事件
    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);

            // 保存监听器引用以便后续移除
            if (!this.listeners.has(event)) {
                this.listeners.set(event, []);
            }
            this.listeners.get(event).push(callback);
        }
    }

    // 移除事件监听
    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);

            const listeners = this.listeners.get(event);
            if (listeners) {
                const index = listeners.indexOf(callback);
                if (index > -1) {
                    listeners.splice(index, 1);
                }
            }
        }
    }

    // 游戏相关方法
    createRoom(roomId) {
        this.emit('createRoom', { roomId });
    }

    joinRoom(roomId) {
        this.emit('joinRoom', { roomId });
    }

    leaveRoom() {
        this.emit('leaveRoom');
    }

    ready() {
        this.emit('ready');
    }

    playCards(cards) {
        this.emit('playCards', { cards });
    }

    pass() {
        this.emit('pass');
    }

    getRoomList() {
        this.emit('getRoomList');
    }
}

// 单例模式
const socketService = new SocketService();

export default socketService;
