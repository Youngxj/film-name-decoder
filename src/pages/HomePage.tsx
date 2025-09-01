import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { parseAndFormatFileName } from "@/lib/utils/parserUtils";
import { FileNameParser } from "@/lib/parsers/fileNameParser";
import { parseFileExtension } from "@/lib/parsers/fileExtensionParser";
import { useIMDBSearch, getIMDBLink } from "@/lib/services/imdbService";
import { getParseHistory, saveParseHistory, clearParseHistory, ParseHistoryItem } from "@/lib/utils/storageUtils";
import HistoryList from "@/components/ui/history-list";

// Scene标签描述
const getSceneTagDescription = (tag: string): string => {
  const descriptions: Record<string, string> = {
    proper: "修正版 - 修复了之前发布版本中的问题",
    repack: "重新打包 - 修复了之前发布的压缩包中的问题",
    readNfo: "请阅读NFO - 发布组在NFO文件中提供了重要信息",
    dirFix: "目录修复 - 修复了之前发布的目录结构问题",
    nfoFix: "NFO修复 - 修复了之前发布的NFO文件中的错误",
    reRip: "重新压制 - 使用相同的源重新压制",
    dupe: "重复发布 - 已有相同或类似的发布",
    subFix: "字幕修复 - 修复了之前发布的字幕问题",
    dubbed: "配音版本 - 包含非原始语言的配音",
    limited: "限量发行 - 影片在有限的影院上映",
    festival: "电影节版本 - 来自电影节的版本",
    internal: "内部发布 - 发布组内部使用的版本",
    stv: "直接发行录像带 - 未在影院上映直接发行",
    ppv: "付费点播 - 来自付费点播服务",
    complete: "完整版 - 包含所有内容的完整版本",
    remastered: "重制版 - 经过重新处理的版本",
    restored: "修复版 - 经过修复的版本",
    ws: "宽屏 - 宽屏版本",
    fs: "全屏 - 全屏版本",
    oar: "原始比例 - 保持原始宽高比",
    retail: "零售版 - 来自零售发行的版本",
    dvdr: "DVD规格 - 符合DVD规格的版本",
    tvSystem: "电视制式 - NTSC或PAL电视制式",
    multi: "多语言 - 包含多种语言音轨",
    multiSubs: "多语言字幕 - 包含多种语言字幕",
    subPack: "字幕包 - 包含多种字幕的集合"
  };

  return descriptions[tag] || `${tag} - 未知Scene标识`;
};

// P2P标签描述
const getP2PTagDescription = (tag: string): string => {
  const descriptions: Record<string, string> = {
    hybrid: "混合版 - 使用多个不同来源合成的版本",
    remux: "无损重封装 - 从原盘中提取视频/音频流并重新封装",
    bdSize: "蓝光容量 - 原盘的容量规格",
    doVi: "杜比视界 - 杜比视界HDR格式的版本",
    hdr10PlusProfile: "HDR10+配置文件 - HDR10+的特定配置",
    bitDepth: "位深 - 视频的色彩位深",
    colorSpace: "色域 - 视频的色彩空间",
    sdrType: "SDR类型 - 标准动态范围的特定类型",
    sdr10: "SDR类型 - 标准动态范围的特定类型",
    dimensionType: "立体格式 - 2D/3D等视频立体格式",
    screenFormat: "画幅版本 - 特殊的画幅比例版本",
    hardcodedSub: "硬字幕 - 内嵌在视频中的字幕",
    watermark: "水印 - 视频中是否有水印",
    editVersion: "剪辑版本 - 特殊的剪辑或编辑版本",
    audioDescription: "音频描述 - 为视障人士提供的音频描述",
    flacAudio: "FLAC音频 - 无损FLAC格式的音轨",
    commentary: "评论轨 - 包含导演/演员等评论音轨",
    extras: "额外内容 - 包含花絮等额外内容",
    encoder: "压制者 - 视频压制者的署名"
  };

  return descriptions[tag] || `${tag} - 未知P2P标识`;
};

const HomePage: React.FC = () => {
  const [fileName, setFileName] = useState<string>("");
  const [parseResult, setParseResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("result");
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [imdbSearching, setImdbSearching] = useState<boolean>(false);
  const [history, setHistory] = useState<ParseHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [stickyNav, setStickyNav] = useState<boolean>(false);

  // 创建各个内容区域的引用
  const resultSectionRef = React.useRef<HTMLDivElement>(null);
  const technicalSectionRef = React.useRef<HTMLDivElement>(null);
  const advancedSectionRef = React.useRef<HTMLDivElement>(null);
  const rulesSectionRef = React.useRef<HTMLDivElement>(null);
  const extensionSectionRef = React.useRef<HTMLDivElement>(null);
  const tabsListRef = React.useRef<HTMLDivElement>(null);

  // 使用IMDB搜索Hook
  const { result: imdbResult, loading: imdbLoading } = useIMDBSearch(
    parseResult?.parts?.title?.value,
    parseResult?.parts?.year?.value
  );

  // 加载历史记录
  useEffect(() => {
    const loadHistory = () => {
      const historyData = getParseHistory();
      setHistory(historyData);
    };

    loadHistory();

    // 添加存储事件监听器，以便在其他标签页更改存储时更新
    const handleStorageChange = () => {
      loadHistory();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 监听滚动事件，控制返回顶部按钮的显示和导航栏固定
  useEffect(() => {
    const handleScroll = () => {
      // 当页面滚动超过300px时显示返回顶部按钮
      setShowBackToTop(window.scrollY > 300);

      // 检查是否应该固定导航栏
      if (tabsListRef.current) {
        const tabsPosition = tabsListRef.current.getBoundingClientRect().top;
        setStickyNav(tabsPosition <= 0);
      }

      // 如果解析结果存在，根据滚动位置更新活动标签
      if (parseResult) {
        // 获取各个区域的位置
        const sections = [
          { id: "result", ref: resultSectionRef },
          { id: "technical", ref: technicalSectionRef },
          { id: "advanced", ref: advancedSectionRef },
          { id: "rules", ref: rulesSectionRef }
        ];

        // 如果文件扩展名存在，添加扩展名区域
        if (parseResult.parts.fileExtension) {
          sections.push({ id: "extension", ref: extensionSectionRef });
        }

        // 找到当前在视口中的区域
        const currentSection = sections.reduce((closest, section) => {
          if (section.ref.current) {
            const rect = section.ref.current.getBoundingClientRect();
            const absDist = Math.abs(rect.top);

            if (rect.top <= 100 && (!closest || absDist < closest.absDist)) {
              return { id: section.id, absDist };
            }
          }
          return closest;
        }, null as { id: string; absDist: number } | null);

        // 更新活动标签
        if (currentSection && currentSection.id !== activeTab) {
          setActiveTab(currentSection.id);
        }
      }
    };

    // 添加滚动事件监听
    window.addEventListener('scroll', handleScroll);

    // 组件卸载时移除事件监听
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [parseResult, activeTab]);

  // 返回顶部的处理函数
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 平滑滚动
    });
  };

  // 处理文件名输入变化
  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  // 处理解析按钮点击
  const handleParse = () => {
    if (!fileName.trim()) return;

    const result = parseAndFormatFileName(fileName);
    console.log('result1', result)
    setParseResult(result);
    setActiveTab("result");
    setImdbSearching(true);

    // 保存到历史记录
    saveParseHistory(fileName, result);
    // 刷新历史记录列表
    setHistory(getParseHistory());
  };

  // 处理示例文件名点击
  const handleExampleClick = (example: string) => {
    setFileName(example);
    const result = parseAndFormatFileName(example);
    setParseResult(result);
    setActiveTab("result");
    setImdbSearching(true);

    // 保存到历史记录
    saveParseHistory(example, result);
    // 刷新历史记录列表
    setHistory(getParseHistory());
  };

  // 处理历史记录选择
  const handleSelectHistory = (item: ParseHistoryItem) => {
    setFileName(item.fileName);
    setParseResult(item.parseResult);
    setActiveTab("result");
    setShowHistory(false);
  };

  // 处理清空历史记录
  const handleClearHistory = () => {
    clearParseHistory();
    setHistory([]);
  };

  // 示例文件名
  const examples = [
    "The.Matrix.1999.1080p.BluRay.x264-SPARKS.mkv",
    "Breaking.Bad.S05E14.720p.HDTV.x264-KILLERS.mp4",
    "Inception.2010.UHD.2160p.HDR.DTS-HD.MA.5.1.x265-TrueHD.mkv",
    "Game.of.Thrones.S08E06.1080p.WEB-DL.Atmos.中字.mp4",
    "Avengers.Endgame.2019.PROPER.1080p.BluRay.DTS-HD.MA.7.1.x264-LEGi0N.mkv",
    "Final.Destination.Bloodlines.2025.Hybrid.2160p.iT.WEB-DL.DDP.5.1.Atmos.DV.HDR10+.H.265-HONE.mkv"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-slate-900 text-white p-4 md:p-8 relative">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 mb-2">
            影视文件名解析器
          </h1>
          <p className="text-blue-300 max-w-2xl mx-auto">
            解析影视文件名，理解命名规则，快速识别文件信息
          </p>
        </header>

        <Card className="bg-slate-900/70 border-slate-800 backdrop-blur-md mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="space-y-1.5">
                <CardTitle className="text-blue-300">输入文件名</CardTitle>
                <CardDescription className="text-slate-400">
                  输入一个影视文件名，我们将解析其中包含的信息
                </CardDescription>
              </div>
              <Button
                variant="outline"
                className="border-blue-800 text-blue-300 hover:bg-blue-900/30"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? "隐藏历史" : "历史记录"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showHistory ? (
              <HistoryList
                history={history}
                onSelectHistory={handleSelectHistory}
                onClearHistory={handleClearHistory}
              />
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  className="flex-1 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  placeholder="例如: Movie.Name.2020.1080p.BluRay.x264-GROUP.mkv"
                  value={fileName}
                  onChange={handleFileNameChange}
                />
                <Button
                  className="bg-blue-600 hover:bg-blue-500 text-white sm:w-auto w-full"
                  onClick={handleParse}
                >
                  解析
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row flex-wrap gap-2 border-t border-slate-800 pt-4">
            <span className="text-sm text-slate-400 w-full sm:w-auto mb-2 sm:mb-0">示例:</span>
            <div className="flex flex-wrap gap-2">
              {examples.map((example, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-900/30 border-blue-800 text-xs sm:text-sm"
                  onClick={() => handleExampleClick(example)}
                >
                  {example.length > 20 ? example.substring(0, 20) + "..." : example}
                </Badge>
              ))}
            </div>
          </CardFooter>
        </Card>

        {parseResult && (
          <Card className="bg-slate-900/70 border-slate-800 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-blue-300">解析结果</CardTitle>
              <CardDescription className="text-slate-400 filename">
                文件名: {parseResult.originalFileName}
              </CardDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                {parseResult.parts.resolution && (
                  <Badge className="bg-purple-900 text-purple-100">
                    {parseResult.parts.resolution.value}
                  </Badge>
                )}
                {parseResult.parts.source && (
                  <Badge className="bg-blue-900 text-blue-100">
                    {typeof parseResult.parts.source.value === 'object'
                      ? parseResult.parts.source.value.value
                      : parseResult.parts.source.value}
                  </Badge>
                )}
                {parseResult.parts.videoCodec && (
                  <Badge className="bg-green-900 text-green-100">
                    {parseResult.parts.videoCodec.value}
                  </Badge>
                )}
                {parseResult.parts.audioCodec && (
                  <Badge className="bg-yellow-900 text-yellow-100">
                    {parseResult.parts.audioCodec.value}
                  </Badge>
                )}
                {parseResult.parts.releaseGroup && (
                  <Badge className="bg-red-900 text-red-100">
                    {parseResult.parts.releaseGroup.value}
                  </Badge>
                )}
                {parseResult.parts.fileExtension && (
                  <Badge className="bg-gray-800 text-gray-100">
                    .{parseResult.parts.fileExtension.value}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <div ref={tabsListRef} className="ceiling-mounted-tabs sticky top-5 md:top-20">
                  <div>
                    {/* 添加一个占位符，防止内容被固定导航栏遮挡 */}
                    <div className="bg-slate-800 mb-4 w-full overflow-x-auto flex-wrap sm:flex-nowrap flex">
                      <button
                        className={`flex-1 min-w-[120px] px-3 py-1.5 rounded-sm ${activeTab === "result" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
                        onClick={() => {
                          setActiveTab("result");
                          resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                      >
                        ℹ️基本信息
                      </button>
                      <button
                        className={`flex-1 min-w-[120px] px-3 py-1.5 rounded-sm ${activeTab === "technical" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
                        onClick={() => {
                          setActiveTab("technical");
                          technicalSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                      >
                        ⚙️技术参数
                      </button>
                      <button
                        className={`flex-1 min-w-[120px] px-3 py-1.5 rounded-sm ${activeTab === "advanced" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
                        onClick={() => {
                          setActiveTab("advanced");
                          advancedSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                      >
                        🔍高级信息
                      </button>
                      <button
                        className={`flex-1 min-w-[120px] px-3 py-1.5 rounded-sm ${activeTab === "rules" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
                        onClick={() => {
                          setActiveTab("rules");
                          rulesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                      >
                        📋匹配规则
                      </button>
                      {parseResult.parts.fileExtension && (
                        <button
                          className={`flex-1 min-w-[120px] px-3 py-1.5 rounded-sm ${activeTab === "extension" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
                          onClick={() => {
                            setActiveTab("extension");
                            extensionSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                        >
                          📁文件格式
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 将所有内容放在一个连续的滚动区域中 */}
                <div className="space-y-12 pt-4">
                  {/* 基本信息区域 */}
                  <div id="result-section" ref={resultSectionRef} className="space-y-6">
                    <h2 className="text-2xl font-bold text-blue-300 mb-4 flex items-center">
                      <span className="mr-2 text-2xl">ℹ️</span>
                      基本信息
                    </h2>
                    {/* 影片基本信息卡片 */}
                    <div className="bg-slate-800/30 p-4 rounded-md">
                      <h3 className="text-blue-300 font-medium text-lg mb-3 border-b border-blue-900/50 pb-2">
                        影片基本信息
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* 片名 */}
                        {parseResult.parts.title && (
                          <div className="bg-slate-800/50 p-2 rounded-md">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                                  <span className="mr-1">🎬</span>{parseResult.parts.title.label}
                                </h4>
                                <p className="text-white text-lg mb-1">{parseResult.parts.title.value}</p>
                                <p className="text-slate-400 text-sm">{parseResult.parts.title.description}</p>
                              </div>

                              {/* IMDB标签 */}
                              {imdbResult && (
                                <a
                                  href={getIMDBLink(imdbResult.imdbID)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center bg-yellow-500 text-black px-2 py-1 rounded hover:bg-yellow-400 transition-colors"
                                >
                                  <span className="font-bold mr-1">IMDb</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              )}

                              {/* IMDB加载中 */}
                              {imdbLoading && (
                                <div className="bg-slate-700 text-slate-300 px-2 py-1 rounded flex items-center">
                                  <span className="mr-1">IMDb</span>
                                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 年份 */}
                        {parseResult.parts.year && (
                          <div className="bg-slate-800/50 p-2 rounded-md">
                            <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                              <span className="mr-1">📅</span>{parseResult.parts.year.label}
                            </h4>
                            <p className="text-white text-lg mb-1">{parseResult.parts.year.value}</p>
                            <p className="text-slate-400 text-sm">{parseResult.parts.year.description}</p>
                          </div>
                        )}

                        {/* 季数 */}
                        {parseResult.parts.season && (
                          <div className="bg-slate-800/50 p-2 rounded-md">
                            <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                              <span className="mr-1">📺</span>{parseResult.parts.season.label}
                            </h4>
                            <p className="text-white text-lg mb-1">{parseResult.parts.season.value}</p>
                            <p className="text-slate-400 text-sm">{parseResult.parts.season.description}</p>
                          </div>
                        )}

                        {/* 集数 */}
                        {parseResult.parts.episode && (
                          <div className="bg-slate-800/50 p-2 rounded-md">
                            <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                              <span className="mr-1">🔢</span>{parseResult.parts.episode.label}
                            </h4>
                            <p className="text-white text-lg mb-1">{parseResult.parts.episode.value}</p>
                            <p className="text-slate-400 text-sm">{parseResult.parts.episode.description}</p>
                          </div>
                        )}

                        {/* 版本类型 */}
                        {parseResult.parts.version && (
                          <div className="bg-slate-800/50 p-2 rounded-md">
                            <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                              <span className="mr-1">🏷️</span>{parseResult.parts.version.label}
                            </h4>
                            <p className="text-white text-lg mb-1">{parseResult.parts.version.value}</p>
                            <p className="text-slate-400 text-sm">{parseResult.parts.version.description}</p>
                          </div>
                        )}

                        {/* 语言 */}
                        {parseResult.parts.language && (
                          <div className="bg-slate-800/50 p-2 rounded-md">
                            <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                              <span className="mr-1">🗣️</span>{parseResult.parts.language.label}
                            </h4>
                            <p className="text-white text-lg mb-1">{parseResult.parts.language.value}</p>
                            <p className="text-slate-400 text-sm">{parseResult.parts.language.description}</p>
                          </div>
                        )}

                        {/* 地区 */}
                        {parseResult.parts.region && (
                          <div className="bg-slate-800/50 p-2 rounded-md">
                            <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                              <span className="mr-1">🌍</span>{parseResult.parts.region.label}
                            </h4>
                            <p className="text-white text-lg mb-1">{parseResult.parts.region.value}</p>
                            <p className="text-slate-400 text-sm">{parseResult.parts.region.description}</p>
                          </div>
                        )}

                        {/* 字幕信息 */}
                        {parseResult.parts.subtitle && (
                          <div className="bg-slate-800/50 p-2 rounded-md">
                            <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                              <span className="mr-1">💬</span>{parseResult.parts.subtitle.label}
                            </h4>
                            <p className="text-white text-lg mb-1">{parseResult.parts.subtitle.value}</p>
                            <p className="text-slate-400 text-sm">{parseResult.parts.subtitle.description}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 来源信息卡片 */}
                    <div className="bg-slate-800/30 p-4 rounded-md">
                      <h3 className="text-blue-300 font-medium text-lg mb-3 border-b border-blue-900/50 pb-2">
                        来源信息
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 片源渠道 */}
                        {parseResult.parts.source && (
                          <div className="bg-slate-800/50 p-2 rounded-md md:col-span-2">
                            <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                              <span className="mr-1">📀</span>{parseResult.parts.source.label}
                            </h4>
                            <p className="text-white text-lg mb-1">
                              {typeof parseResult.parts.source.value === 'object'
                                ? parseResult.parts.source.value.value
                                : parseResult.parts.source.value}
                            </p>
                            <p className="text-slate-400 text-sm">{parseResult.parts.source.description}</p>

                            {/* 显示视频来源的中文解释 */}
                            {parseResult.parts.source.explanation && (
                              <div className="mt-2 pt-2 border-t border-slate-700">
                                <div className="flex items-center mb-1">
                                  <span className="text-green-400 font-medium mr-2">{parseResult.parts.source.explanation.name}</span>
                                  <span className="bg-blue-900/50 text-blue-200 text-xs px-2 py-0.5 rounded">
                                    {parseResult.parts.source.explanation.quality}
                                  </span>
                                </div>
                                <p className="text-white text-sm mb-2">{parseResult.parts.source.explanation.description}</p>

                                <div className="mt-2">
                                  <h5 className="text-blue-300 text-xs font-medium mb-1">典型特征：</h5>
                                  <ul className="list-disc list-inside text-slate-300 text-xs space-y-0.5">
                                    {parseResult.parts.source.explanation.typical.map((feature: string, i: number) => (
                                      <li key={i}>{feature}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 流媒体平台 */}
                        {parseResult.parts.streamingPlatform && (
                          <div className="bg-slate-800/50 p-2 rounded-md">
                            <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                              <span className="mr-1">📡</span>{parseResult.parts.streamingPlatform.label}
                            </h4>
                            <p className="text-white text-lg mb-1">{parseResult.parts.streamingPlatform.value}</p>
                            <p className="text-slate-400 text-sm">{parseResult.parts.streamingPlatform.description}</p>
                          </div>
                        )}

                        {/* 发布组 */}
                        {parseResult.parts.releaseGroup && (
                          <div className="bg-slate-800/50 p-2 rounded-md">
                            <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                              <span className="mr-1">👥</span>{parseResult.parts.releaseGroup.label}
                            </h4>
                            <p className="text-white text-lg mb-1">{parseResult.parts.releaseGroup.value}</p>
                            <p className="text-slate-400 text-sm">{parseResult.parts.releaseGroup.description}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 未识别部分 */}
                    {parseResult.unrecognized && (
                      <div className="bg-slate-800/30 p-4 rounded-md">
                        <h3 className="text-amber-400 font-medium text-lg mb-3 border-b border-amber-900/50 pb-2">
                          未识别部分
                        </h3>
                        <div className="bg-slate-800/50 p-2 rounded-md">
                          <p className="text-white text-lg mb-1">{parseResult.unrecognized}</p>
                          <p className="text-slate-400 text-sm">这些部分未能被任何规则匹配</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 技术参数区域 */}
                <div id="technical-section" ref={technicalSectionRef} className="space-y-6 pt-6">
                  <h2 className="text-2xl font-bold text-blue-300 mb-4 flex items-center">
                    <span className="mr-2 text-2xl">⚙️</span>
                    技术参数
                  </h2>
                  {/* 视频参数卡片 */}
                  <div className="bg-slate-800/30 p-4 rounded-md">
                    <h3 className="text-blue-300 font-medium text-lg mb-3 border-b border-blue-900/50 pb-2">
                      视频参数
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 分辨率 */}
                      {parseResult.parts.resolution && (
                        <div className="bg-slate-800/50 p-2 rounded-md">
                          <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                            <span className="mr-1">📊</span>{parseResult.parts.resolution.label}
                          </h4>
                          <p className="text-white text-lg mb-1">{parseResult.parts.resolution.value}</p>
                          <p className="text-slate-400 text-sm">{parseResult.parts.resolution.description}</p>
                        </div>
                      )}

                      {/* 视频编码 */}
                      {parseResult.parts.videoCodec && (
                        <div className="bg-slate-800/50 p-2 rounded-md">
                          <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                            <span className="mr-1">🎞️</span>视频编码
                          </h4>
                          <p className="text-white text-lg mb-1">{parseResult.parts.videoCodec.value}</p>
                          <p className="text-slate-400 text-sm">视频的编码格式</p>
                        </div>
                      )}

                      {/* HDR信息 */}
                      {parseResult.parts.hdr && (
                        <div className="bg-slate-800/50 p-2 rounded-md">
                          <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                            <span className="mr-1">✨</span>HDR信息
                          </h4>
                          <p className="text-white text-lg mb-1">{parseResult.parts.hdr.value}</p>
                          <p className="text-slate-400 text-sm">高动态范围视频格式</p>
                        </div>
                      )}

                      {/* 帧率 */}
                      {parseResult.parts.frameRate && (
                        <div className="bg-slate-800/50 p-2 rounded-md">
                          <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                            <span className="mr-1">⏱️</span>帧率
                          </h4>
                          <p className="text-white text-lg mb-1">{parseResult.parts.frameRate.value}</p>
                          <p className="text-slate-400 text-sm">视频的每秒帧数</p>
                        </div>
                      )}

                      {/* 色深 */}
                      {parseResult.parts.colorDepth && (
                        <div className="bg-slate-800/50 p-2 rounded-md">
                          <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                            <span className="mr-1">🎨</span>色深
                          </h4>
                          <p className="text-white text-lg mb-1">{parseResult.parts.colorDepth.value}</p>
                          <p className="text-slate-400 text-sm">视频的位深度</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 音频参数卡片 */}
                  <div className="bg-slate-800/30 p-4 rounded-md">
                    <h3 className="text-blue-300 font-medium text-lg mb-3 border-b border-blue-900/50 pb-2">
                      音频参数
                    </h3>
                    {(parseResult.parts.audioCodec && Object.keys(parseResult.parts.audioCodec.value).length > 0) ||
                      (parseResult.parts.audioChannels && Object.keys(parseResult.parts.audioChannels.value).length > 0) ||
                      (parseResult.parts.audioCodecChannels && parseResult.parts.audioCodecChannels.value.length > 0) ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* 音频编码 */}
                          {parseResult.parts.audioCodec && (
                            <div className="bg-slate-800/50 p-2 rounded-md">
                              <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                                <span className="mr-1">🔊</span>音频编码
                              </h4>
                              <p className="text-white text-lg mb-1">{parseResult.parts.audioCodec.value}</p>
                              <p className="text-slate-400 text-sm">音频的编码格式</p>
                            </div>
                          )}

                          {/* 声道布局 */}
                          {parseResult.parts.audioChannels && (
                            <div className="bg-slate-800/50 p-2 rounded-md">
                              <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                                <span className="mr-1">🔈</span>{parseResult.parts.audioChannels.label}
                              </h4>
                              <p className="text-white text-lg mb-1">{parseResult.parts.audioChannels.value}</p>
                              <p className="text-slate-400 text-sm">{parseResult.parts.audioChannels.description}</p>
                            </div>
                          )}

                          {/* 特定音频编码通道 */}
                          {parseResult.parts.audioCodecChannels && (
                            <div className="bg-slate-800/50 p-2 rounded-md">
                              <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                                <span className="mr-1">🎵</span>{parseResult.parts.audioCodecChannels.label}
                              </h4>
                              <p className="text-white text-lg mb-1">{parseResult.parts.audioCodecChannels.value}</p>
                              <p className="text-slate-400 text-sm">{parseResult.parts.audioCodecChannels.description}</p>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="text-5xl mb-4">🔈</div>
                        <h3 className="text-blue-300 font-medium text-lg mb-2">没有检测到音频参数</h3>
                        <p className="text-slate-400 max-w-md">
                          该文件名中没有包含音频编码、声道布局或其他音频相关信息。
                          这可能是因为文件名格式简化或音频信息未在命名中体现。
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 高级信息区域 */}
                <div id="advanced-section" ref={advancedSectionRef} className="space-y-6 pt-6">
                  <h2 className="text-2xl font-bold text-blue-300 mb-4 flex items-center">
                    <span className="mr-2 text-2xl">🔍</span>
                    高级信息
                  </h2>

                  {/* 检查是否有高级信息内容 */}
                  {(parseResult.parts.sceneInfo && Object.keys(parseResult.parts.sceneInfo).length > 0) ||
                    (parseResult.parts.p2pInfo && Object.keys(parseResult.parts.p2pInfo).length > 0) ||
                    (parseResult.parts.tags && parseResult.parts.tags.length > 0) ? (
                    <>
                      {/* Scene标准信息 */}
                      {parseResult.parts.sceneInfo && Object.keys(parseResult.parts.sceneInfo).length > 0 && (
                        <div className="bg-slate-800/30 p-4 rounded-md">
                          <h3 className="text-blue-300 font-medium text-lg mb-3 border-b border-blue-900/50 pb-2">
                            Scene标准信息
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-800/50 p-2 rounded-md">
                              <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                                <span className="mr-1">🏆</span>{parseResult.parts.sceneInfo.label}
                              </h4>
                              <p className="text-white text-lg mb-1">{String(parseResult.parts.sceneInfo.value)}</p>
                              <p className="text-slate-400 text-sm">{getSceneTagDescription(String(parseResult.parts.sceneInfo.value).toLowerCase())}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* P2P扩展信息 */}
                      {parseResult.parts.p2pInfo && Object.keys(parseResult.parts.p2pInfo).length > 0 && (
                        <div className="bg-slate-800/30 p-4 rounded-md">
                          <h3 className="text-blue-300 font-medium text-lg mb-3 border-b border-blue-900/50 pb-2">
                            P2P扩展信息
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(parseResult.parts.p2pInfo).map(([key, value], index) => {
                              return (
                                <div key={index} className="bg-slate-800/50 p-2 rounded-md">
                                  <h4 className="text-blue-300 font-medium mb-1 flex items-center">
                                    <span className="mr-1">🔄</span>P2P扩展标识
                                  </h4>
                                  <p className="text-white text-lg mb-1">{String(value)}</p>
                                  <p className="text-slate-400 text-sm">{getP2PTagDescription(key)}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 其他标签 */}
                      {parseResult.parts.tags && parseResult.parts.tags.value.length > 0 && (
                        <div className="bg-slate-800/30 p-4 rounded-md">
                          <h3 className="text-blue-300 font-medium text-lg mb-3 border-b border-blue-900/50 pb-2">
                            其他标签
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(parseResult.parts.tags.value) ?
                              parseResult.parts.tags.value.map((tag: string, index : number) => (
                                <Badge key={index} className="bg-blue-900 hover:bg-blue-800 text-white">
                                  {tag}
                                </Badge>
                              )) :
                              <Badge className="bg-blue-900 hover:bg-blue-800 text-white">
                                {parseResult.parts.tags.join(',')}
                              </Badge>
                            }
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-slate-800/30 p-4 rounded-md">
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="text-5xl mb-4">🔎</div>
                        <h3 className="text-blue-300 font-medium text-lg mb-2">没有检测到高级信息</h3>
                        <p className="text-slate-400 max-w-md">
                          该文件名中没有包含Scene标准标签、P2P扩展信息或其他特殊标签。
                          这些信息通常出现在更详细的发布版本中。
                        </p>
                      </div>
                    </div>
                  )}
                </div>


                {/* 匹配规则区域 */}
                <div id="rules-section" ref={rulesSectionRef} className="space-y-6 pt-6">
                  <h2 className="text-2xl font-bold text-blue-300 mb-4 flex items-center">
                    <span className="mr-2 text-2xl">📋</span>
                    匹配规则
                  </h2>
                  <div className="bg-slate-800/30 p-4 rounded-md">
                    <h3 className="text-blue-300 font-medium text-lg mb-3 border-b border-blue-900/50 pb-2">
                      匹配到的规则
                    </h3>
                    {parseResult.matchedRules && parseResult.matchedRules.length > 0 ? (
                      <div className="space-y-2">
                        {parseResult.matchedRules.map((rule: { name: string; description: string; category: string; examples: string[] }, index: number) => (
                          <div key={index} className="bg-slate-800/50 p-2 rounded-md">
                            <h3 className="text-blue-300 font-medium mb-1">{rule.name}</h3>
                            <p className="text-white mb-2">{rule.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="border-blue-800 text-blue-300">
                                {rule.category}
                              </Badge>
                              {rule.examples.map((example: string, i: number) => (
                                <Badge key={i} variant="secondary" className="bg-slate-700 text-slate-300">
                                  {example}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400">未匹配到任何规则</p>
                    )}
                  </div>
                </div>

                {/* 文件格式区域 */}
                {parseResult.parts.fileExtension && (
                  <div id="extension-section" ref={extensionSectionRef} className="space-y-6 pt-6">
                    <h2 className="text-2xl font-bold text-blue-300 mb-4 flex items-center">
                      <span className="mr-2 text-2xl">📁</span>
                      文件格式
                    </h2>
                    <div className="bg-slate-800/30 p-4 rounded-md">
                      <h3 className="text-blue-300 font-medium text-lg mb-3 border-b border-blue-900/50 pb-2">
                        文件格式信息
                      </h3>
                      <div className="bg-slate-800/50 p-2 rounded-md">
                        <div className="flex items-center mb-2">
                          <h4 className="text-blue-300 font-medium mr-2 flex items-center">
                            <span className="mr-1">📦</span>容器格式
                          </h4>
                          <Badge className="bg-purple-900 hover:bg-purple-800 text-white">
                            .{parseResult.parts.fileExtension.value}
                          </Badge>
                        </div>
                        <p className="text-white mb-4">{parseResult.parts.fileExtension.explanation}</p>

                        <div className="mt-4 pt-4 border-t border-slate-700">
                          <h4 className="text-blue-300 font-medium mb-2">容器格式特点</h4>
                          <ul className="list-disc list-inside text-slate-300 space-y-1">
                            {parseResult.parts.fileExtension.value === 'mkv' && (
                              <>
                                <li>支持几乎所有视频和音频编码格式</li>
                                <li>支持多音轨、多字幕轨道</li>
                                <li>支持章节标记和元数据</li>
                                <li>开源格式，无专利限制</li>
                              </>
                            )}
                            {parseResult.parts.fileExtension.value === 'mp4' && (
                              <>
                                <li>广泛兼容的容器格式</li>
                                <li>支持流媒体传输</li>
                                <li>支持大多数现代设备和播放器</li>
                                <li>适合网络分享和在线播放</li>
                              </>
                            )}
                            {parseResult.parts.fileExtension.value === 'avi' && (
                              <>
                                <li>较旧但兼容性好的格式</li>
                                <li>支持多种编解码器</li>
                                <li>简单的结构，易于处理</li>
                                <li>在旧设备上有良好支持</li>
                              </>
                            )}
                            {parseResult.parts.fileExtension.value === 'ts' && (
                              <>
                                <li>用于数字广播的传输流格式</li>
                                <li>支持实时流媒体</li>
                                <li>适合卫星、有线电视传输</li>
                                <li>支持多路复用</li>
                              </>
                            )}
                            {parseResult.parts.fileExtension.value === 'm2ts' && (
                              <>
                                <li>蓝光光盘使用的格式</li>
                                <li>支持高清视频和高质量音频</li>
                                <li>支持多音轨和字幕</li>
                                <li>基于MPEG-2传输流</li>
                              </>
                            )}
                            {!['mkv', 'mp4', 'avi', 'ts', 'm2ts'].includes(parseResult.parts.fileExtension.value) && (
                              <li>常见的视频容器格式</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 返回顶部按钮 */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-8 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-lg transition-all duration-300"
          aria-label="返回顶部"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default HomePage;