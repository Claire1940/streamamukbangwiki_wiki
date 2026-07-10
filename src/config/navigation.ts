import type { LucideIcon } from 'lucide-react'
import {
	Armchair,
	BookOpen,
	Coins,
	Gift,
	Newspaper,
	TrendingUp,
	Users,
	UtensilsCrossed,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// 8 个内容分类，按玩家成长路径排序：
// 兑换码 → 新手 → 食物 → 现金 → 观众 → 设备升级 → 房间豪宅 → 更新
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'codes', path: '/codes', icon: Gift, isContentType: true },
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'food', path: '/food', icon: UtensilsCrossed, isContentType: true },
	{ key: 'currency', path: '/currency', icon: Coins, isContentType: true },
	{ key: 'audience', path: '/audience', icon: Users, isContentType: true },
	{ key: 'upgrades', path: '/upgrades', icon: Armchair, isContentType: true },
	{ key: 'progression', path: '/progression', icon: TrendingUp, isContentType: true },
	{ key: 'updates', path: '/updates', icon: Newspaper, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['codes', 'build', 'combat', 'guides']

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
