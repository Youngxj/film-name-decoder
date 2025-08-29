import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllFileExtensions, FileExtensionInfo } from "@/lib/parsers/fileExtensionParser";

const ExtensionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [filteredExtensions, setFilteredExtensions] = useState<FileExtensionInfo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [allExtensions, setAllExtensions] = useState<FileExtensionInfo[]>([]);

  // 初始化文件后缀和分类
  useEffect(() => {
    // 获取所有文件后缀
    const extensions = getAllFileExtensions();
    setAllExtensions(extensions);
    setFilteredExtensions(extensions);
    
    // 提取所有分类
    const uniqueCategories = Array.from(new Set(extensions.map(ext => ext.category)));
    setCategories(uniqueCategories);
  }, []);

  // 处理搜索和分类过滤
  useEffect(() => {
    let result = allExtensions;
    
    // 按分类过滤
    if (activeCategory !== "all") {
      result = result.filter(ext => ext.category === activeCategory);
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        ext =>
          ext.extension.toLowerCase().includes(term) ||
          ext.name.toLowerCase().includes(term) ||
          ext.description.toLowerCase().includes(term) ||
          (ext.containerFormat && ext.containerFormat.toLowerCase().includes(term)) ||
          (ext.typicalCodecs && ext.typicalCodecs.some(codec => codec.toLowerCase().includes(term)))
      );
    }
    
    setFilteredExtensions(result);
  }, [searchTerm, activeCategory, allExtensions]);

  // 处理搜索输入变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 处理分类切换
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 mb-2">
            影视文件格式库
          </h1>
          <p className="text-blue-300 max-w-2xl mx-auto">
            了解各种影视文件格式的特点和用途
          </p>
        </header>

        <Card className="bg-slate-900/70 border-slate-800 backdrop-blur-md mb-8">
          <CardHeader>
            <CardTitle className="text-blue-300">搜索文件格式</CardTitle>
            <CardDescription className="text-slate-400">
              输入关键词搜索文件格式
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              placeholder="搜索文件格式、名称、描述或编码..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-900/70 border-slate-800 backdrop-blur-md h-fit">
            <CardHeader>
              <CardTitle className="text-blue-300">文件类别</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                <button
                  className={`text-left px-4 py-3 border-l-2 ${
                    activeCategory === "all"
                      ? "border-blue-500 bg-blue-900/20 text-blue-300"
                      : "border-transparent hover:border-blue-800 hover:bg-slate-800/50"
                  }`}
                  onClick={() => handleCategoryChange("all")}
                >
                  全部格式
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`text-left px-4 py-3 border-l-2 ${
                      activeCategory === category
                        ? "border-blue-500 bg-blue-900/20 text-blue-300"
                        : "border-transparent hover:border-blue-800 hover:bg-slate-800/50"
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-3">
            <Card className="bg-slate-900/70 border-slate-800 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-blue-300">
                  {activeCategory === "all" ? "所有文件格式" : `${activeCategory}格式`}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {searchTerm && `搜索: "${searchTerm}" • `}
                  找到 {filteredExtensions.length} 种文件格式
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredExtensions.length > 0 ? (
                  <div className="space-y-6">
                    {filteredExtensions.map((ext) => (
                      <Card key={ext.extension} className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-blue-300 flex items-center">
                                <span className="text-xl">.{ext.extension}</span>
                                <span className="ml-2 text-lg text-slate-300">- {ext.name}</span>
                              </CardTitle>
                            </div>
                            <Badge className="bg-blue-900/50 text-blue-200">
                              {ext.category}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-white mb-4">{ext.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {ext.containerFormat && (
                              <div>
                                <h4 className="text-sm font-medium text-slate-400 mb-1">容器格式</h4>
                                <p className="text-white">{ext.containerFormat}</p>
                              </div>
                            )}
                          </div>
                          
                          {ext.typicalCodecs && ext.typicalCodecs.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-slate-400 mb-2">常见编码</h4>
                              <div className="flex flex-wrap gap-2">
                                {ext.typicalCodecs.map((codec, index) => (
                                  <Badge key={index} className="bg-blue-900/50 text-blue-200">
                                    {codec}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ext.pros && ext.pros.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-green-400 mb-2">优点</h4>
                                <ul className="list-disc list-inside text-white space-y-1">
                                  {ext.pros.map((pro, index) => (
                                    <li key={index}>{pro}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {ext.cons && ext.cons.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-red-400 mb-2">缺点</h4>
                                <ul className="list-disc list-inside text-white space-y-1">
                                  {ext.cons.map((con, index) => (
                                    <li key={index}>{con}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-400">没有找到匹配的文件格式</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionsPage;