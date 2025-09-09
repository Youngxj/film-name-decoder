import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ParseHistoryItem, deleteParseHistoryItem } from "@/lib/utils/storageUtils";

interface HistoryListProps {
  history: ParseHistoryItem[];
  onSelectHistory: (item: ParseHistoryItem) => void;
  onClearHistory: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ 
  history, 
  onSelectHistory,
  onClearHistory
}) => {
  // 格式化日期
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 删除单个历史记录
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteParseHistoryItem(id);
    // 通知父组件刷新历史记录
    onClearHistory();
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>暂无解析历史记录</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-blue-600 dark:text-blue-300 font-medium text-lg">历史解析记录</h3>
        <Button 
          variant="outline" 
          size="sm"
          className="text-muted-foreground border-border hover:bg-muted hover:text-foreground"
          onClick={onClearHistory}
        >
          清空历史
        </Button>
      </div>
      
      <div className="space-y-3">
        {history.map((item) => (
          <Card 
            key={item.id} 
            className="bg-muted/50 border-border hover:bg-muted/70 transition-colors cursor-pointer"
            onClick={() => onSelectHistory(item)}
          >
            <CardHeader className="py-3 px-4">
              <div className="flex justify-between items-start">
                <div className="truncate pr-4">
                  <CardTitle className="text-blue-600 dark:text-blue-300 text-base font-medium truncate">
                    {item.fileName}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-xs">
                    {formatDate(item.timestamp)}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400 hover:bg-muted/50"
                  onClick={(e) => handleDelete(e, item.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                  <span className="sr-only">删除</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <div className="flex flex-wrap gap-2">
                {/* 显示关键信息标签 */}
                {item.parseResult.parts.title && (
                  <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800">
                    {item.parseResult.parts.title.value}
                  </Badge>
                )}
                {item.parseResult.parts.year && (
                  <Badge className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800">
                    {item.parseResult.parts.year.value}
                  </Badge>
                )}
                {item.parseResult.parts.resolution && (
                  <Badge className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800">
                    {item.parseResult.parts.resolution.value}
                  </Badge>
                )}
                {item.parseResult.parts.source && (
                  <Badge className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800">
                    {typeof item.parseResult.parts.source.value === 'object' 
                      ? item.parseResult.parts.source.value.value 
                      : item.parseResult.parts.source.value}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;