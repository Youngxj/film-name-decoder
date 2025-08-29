/**
 * 规则分类数据库
 * 包含各种规则分类及其描述
 */
export interface RuleCategory {
  id: string;
  name: string;
  description: string;
  importance: number; // 重要性排序，数字越小越重要
}

export const ruleCategories: RuleCategory[] = [
  {
    id: '基本信息',
    name: '基本信息',
    description: '影片的基本信息，如标题、年份等',
    importance: 1
  },
  {
    id: '剧集信息',
    name: '剧集信息',
    description: '电视剧的季数、集数等信息',
    importance: 2
  },
  {
    id: '视频质量',
    name: '视频质量',
    description: '视频的分辨率、HDR等质量相关信息',
    importance: 3
  },
  {
    id: '视频编码',
    name: '视频编码',
    description: '视屏编码格式',
    importance: 4
  },
  {
    id: '音频编码',
    name: '音频编码',
    description: '音频编码格式',
    importance: 5
  },
  {
    id: '来源信息',
    name: '来源信息',
    description: '影片的来源，如蓝光、WEB、DVD等',
    importance: 6
  },
  {
    id: '发布信息',
    name: '发布信息',
    description: '发布影片的组织或个人信息',
    importance: 7
  },
  {
    id: '字幕信息',
    name: '字幕信息',
    description: '字幕相关的信息，如硬字幕、中字等',
    importance: 8
  },
  {
    id: '版本信息',
    name: '版本信息',
    description: '影片的版本信息，如导演剪辑版、加长版等',
    importance: 9
  },
  {
    id: '文件信息',
    name: '文件信息',
    description: '文件相关的信息，如文件格式等',
    importance: 10
  },
  {
    id: '其他信息',
    name: '其他信息',
    description: '其他类型的信息，如特殊标签等',
    importance: 11
  }
];

/**
 * 获取所有规则分类
 * @returns 所有规则分类
 */
export function getAllCategories(): RuleCategory[] {
  return ruleCategories;
}

/**
 * 根据ID获取规则分类
 * @param id 分类ID
 * @returns 规则分类
 */
export function getCategoryById(id: string): RuleCategory | undefined {
  return ruleCategories.find(category => category.id === id);
}

/**
 * 获取按重要性排序的规则分类
 * @returns 按重要性排序的规则分类
 */
export function getCategoriesByImportance(): RuleCategory[] {
  return [...ruleCategories].sort((a, b) => a.importance - b.importance);
}