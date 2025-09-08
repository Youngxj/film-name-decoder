import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { rules } from "@/lib/database/rules";
import { ruleCategories, RuleCategory } from "@/lib/database/ruleCategories";
import { Rule } from "@/lib/parsers/types";
import SEO from "@/components/SEO";

const RulesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [filteredRules, setFilteredRules] = useState<Rule[]>([]);
  const [categories, setCategories] = useState<RuleCategory[]>([]);

  // 初始化规则和分类
  useEffect(() => {
    // 获取所有规则
    const allRules = Object.values(rules);
    setFilteredRules(allRules);
    
    // 获取所有分类并排序
    const sortedCategories = [...ruleCategories].sort((a, b) => a.importance - b.importance);
    setCategories(sortedCategories);
  }, []);

  // 处理搜索和分类过滤
  useEffect(() => {
    let result = Object.values(rules);
    
    // 按分类过滤
    if (activeCategory !== "all") {
      result = result.filter(rule => rule.category === activeCategory);
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        rule =>
          rule.name.toLowerCase().includes(term) ||
          rule.description.toLowerCase().includes(term) ||
          rule.examples.some(example => example.toLowerCase().includes(term))
      );
    }
    
    setFilteredRules(result);
  }, [searchTerm, activeCategory]);

  // 处理搜索输入变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 处理分类切换
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <>
      <SEO 
        title="解析规则库 - Film Name Decoder | 查看文件名解析规则详情"
        description="详细的影视文件名解析规则库，包含Scene发布规范、P2P命名规则、视频编码标准、音频格式识别等专业规则。帮助理解影视文件名的构成和含义。"
        keywords="Scene规则,P2P发布规范,视频编码规则,音频格式标准,文件名命名规范,影视发布标准,媒体文件规则,解析规则库"
        url="/rules"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-950 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 mb-2">
            影视文件命名规则库
          </h1>
          <p className="text-blue-300 max-w-2xl mx-auto">
            了解各种影视文件命名规则的含义和用法
          </p>
        </header>

        <Card className="bg-slate-900/70 border-slate-800 backdrop-blur-md mb-8">
          <CardHeader>
            <CardTitle className="text-blue-300">搜索规则</CardTitle>
            <CardDescription className="text-slate-400">
              输入关键词搜索命名规则
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              placeholder="搜索规则名称、描述或示例..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-900/70 border-slate-800 backdrop-blur-md h-fit">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-blue-300">规则分类</CardTitle>
              <Badge className="bg-blue-900/50 text-blue-200">
                {filteredRules.length} 条规则
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-row lg:flex-col overflow-x-auto pb-2 lg:pb-0">
                <button
                  className={`text-center lg:text-left px-3 py-2 lg:px-4 lg:py-3 whitespace-nowrap border-l-0 lg:border-l-2 border-b-2 lg:border-b-0 ${
                    activeCategory === "all"
                      ? "border-blue-500 bg-blue-900/20 text-blue-300"
                      : "border-transparent hover:border-blue-800 hover:bg-slate-800/50"
                  }`}
                  onClick={() => handleCategoryChange("all")}
                >
                  全部规则
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`text-center lg:text-left px-3 py-2 lg:px-4 lg:py-3 whitespace-nowrap border-l-0 lg:border-l-2 border-b-2 lg:border-b-0 ${
                      activeCategory === category.id
                        ? "border-blue-500 bg-blue-900/20 text-blue-300"
                        : "border-transparent hover:border-blue-800 hover:bg-slate-800/50"
                    }`}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            <Card className="bg-slate-900/70 border-slate-800 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-blue-300">
                  {activeCategory === "all" ? "所有规则" : categories.find(c => c.id === activeCategory)?.name || "规则"}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {activeCategory === "all" 
                    ? "显示所有命名规则" 
                    : categories.find(c => c.id === activeCategory)?.description || ""}
                  {searchTerm && ` • 搜索: "${searchTerm}"`}
                  {` • 找到 ${filteredRules.length} 条规则`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredRules.length > 0 ? (
                  <div className="space-y-4">
                    {filteredRules.map((rule) => (
                      <Card key={rule.id} className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                            <CardTitle className="text-blue-300">{rule.name}</CardTitle>
                            <Badge className="bg-blue-900/50 text-blue-200">
                              {rule.category}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-white mb-4">{rule.description}</p>
                          
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-slate-400 mb-2">正则表达式模式</h4>
                            <div className="bg-slate-900 p-2 rounded font-mono text-sm text-green-400 overflow-x-auto">
                              {rule.pattern.toString()}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-slate-400 mb-2">示例</h4>
                            <div className="flex flex-wrap gap-2">
                              {rule.examples.map((example, index) => (
                                <Badge key={index} variant="outline" className="border-slate-600">
                                  {example}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-400">没有找到匹配的规则</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default RulesPage;