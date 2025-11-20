// 中国风主题配置
export const theme = {
    // 颜色系统
    colors: {
        primary: '#C8102E',      // 中国红
        secondary: '#FFD700',    // 金黄色
        background: '#2C1810',   // 深棕色背景
        surface: '#3D2817',      // 棕色表面
        card: '#4A3426',         // 卡片背景

        // 文字颜色
        text: '#E8DCC4',         // 米黄色文字
        textDark: '#8B7355',     // 深色文字
        textLight: '#FFF8DC',    // 浅色文字

        // 状态颜色
        success: '#52C41A',
        error: '#F5222D',
        warning: '#FAAD14',

        // 扑克牌颜色
        cardRed: '#D32F2F',
        cardBlack: '#212121',
    },

    // 字体
    fonts: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
        chinese: 'STKaiti', // 楷体
    },

    // 字体大小
    fontSizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 24,
        xxl: 32,
    },

    // 间距
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },

    // 圆角
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 20,
    },

    // 阴影
    shadows: {
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 2,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.30,
            shadowRadius: 4.65,
            elevation: 8,
        },
        large: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.37,
            shadowRadius: 7.49,
            elevation: 12,
        },
    },
};

// 中国风图案样式
export const patterns = {
    祥云: '☁️',
    龙: '🐉',
    凤凰: '🦅',
    竹子: '🎋',
    灯笼: '🏮',
};
