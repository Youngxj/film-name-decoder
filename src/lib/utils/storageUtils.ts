/**
 * 本地存储工具函数
 */

// 历史记录的最大数量
const MAX_HISTORY_ITEMS = 10;

// 历史记录类型定义
export interface ParseHistoryItem {
  id: string;
  fileName: string;
  timestamp: number;
  parseResult: any;
}

/**
 * 保存解析历史记录
 * @param fileName 文件名
 * @param parseResult 解析结果
 */
export function saveParseHistory(fileName: string, parseResult: any): void {
  try {
    // 获取现有历史记录
    const history = getParseHistory();
    
    // 创建新的历史记录项
    const newItem: ParseHistoryItem = {
      id: generateId(),
      fileName,
      timestamp: Date.now(),
      parseResult
    };
    
    // 检查是否已存在相同文件名的记录，如果有则移除
    const filteredHistory = history.filter(item => item.fileName !== fileName);
    
    // 添加新记录到开头（最新的在前面）
    const updatedHistory = [newItem, ...filteredHistory];
    
    // 如果超过最大数量，则截取
    const limitedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);
    
    // 保存到本地存储
    localStorage.setItem('parseHistory', JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('保存解析历史失败:', error);
  }
}

/**
 * 获取解析历史记录
 * @returns 历史记录数组
 */
export function getParseHistory(): ParseHistoryItem[] {
  try {
    const historyJson = localStorage.getItem('parseHistory');
    if (!historyJson) return [];
    
    return JSON.parse(historyJson);
  } catch (error) {
    console.error('获取解析历史失败:', error);
    return [];
  }
}

/**
 * 清除所有解析历史记录
 */
export function clearParseHistory(): void {
  try {
    localStorage.removeItem('parseHistory');
  } catch (error) {
    console.error('清除解析历史失败:', error);
  }
}

/**
 * 删除特定的解析历史记录
 * @param id 要删除的历史记录ID
 */
export function deleteParseHistoryItem(id: string): void {
  try {
    const history = getParseHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem('parseHistory', JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('删除解析历史项失败:', error);
  }
}

/**
 * 生成唯一ID
 * @returns 唯一ID字符串
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}