import { ParseResult, Rule, RuleSet } from './types';
import { rules } from '../database/rules';

/**
 * 文件名解析器类
 * 负责解析影视文件名并提取有用信息
 */
export class FileNameParser {
  private rules: RuleSet;

  constructor(customRules?: RuleSet) {
    // 合并默认规则和自定义规则
    this.rules = { ...rules, ...customRules };
  }

  /**
   * 解析文件名
   * @param fileName 要解析的文件名
   * @returns 解析结果
   */
  parse(fileName: string): ParseResult {
    // 初始化解析结果
    const result: ParseResult = {
      originalFileName: fileName,
      parts: {},
      matchedRules: [],
      titleMatchedText: '',
    };
    

    // 提取文件扩展名
    const extensionMatch = fileName.match(/\.(mkv|mp4|avi|wmv|flv|mov|m4v|mpg|mpeg|ts|m2ts)$/i);
    
    if (extensionMatch) {
      result.parts.fileExtension = {
        value: extensionMatch[1].toLowerCase(),
        explanation: `文件扩展名: ${extensionMatch[1].toLowerCase()}`
      };
      // 移除扩展名以便进一步解析
      fileName = fileName.substring(0, fileName.length - extensionMatch[0].length);
    } else {
      // 如果没有识别到文件后缀，设置为未指定
      result.parts.fileExtension = {
        value: '未指定',
        explanation: '未检测到文件扩展名'
      };
    }
    
    
    // 初始化所有可能的字段，确保与types.ts中的定义一致
    // 基本信息
    result.parts.title = result.parts.title || undefined;
    result.parts.year = result.parts.year || undefined;
    result.parts.version = result.parts.version || undefined;
    result.parts.resolution = result.parts.resolution || undefined;
    result.parts.source = result.parts.source || undefined;
    result.parts.streamingPlatform = result.parts.streamingPlatform || undefined;
    
    // 编码信息
    result.parts.videoCodec = result.parts.videoCodec || undefined;
    result.parts.audioCodec = result.parts.audioCodec || undefined;
    result.parts.audioChannels = result.parts.audioChannels || undefined;
    result.parts.hdr = result.parts.hdr || undefined;
    
    // 高级参数
    result.parts.frameRate = result.parts.frameRate || undefined;
    result.parts.colorDepth = result.parts.colorDepth || undefined;
    
    // 发布信息
    result.parts.releaseGroup = result.parts.releaseGroup || undefined;
    
    // 剧集信息
    result.parts.season = result.parts.season || undefined;
    result.parts.episode = result.parts.episode || undefined;
    
    // 其他信息
    result.parts.language = result.parts.language || undefined;
    result.parts.region = result.parts.region || undefined;
    result.parts.subtitle = result.parts.subtitle || undefined;
    result.parts.tags = result.parts.tags || undefined;
    
    // 复杂对象初始化
    result.parts.sceneInfo = result.parts.sceneInfo || {};
    result.parts.p2pInfo = result.parts.p2pInfo || {};
    
    // P2P信息中的字段
    if (result.parts.p2pInfo) {
      result.parts.p2pInfo.colorSpace = result.parts.p2pInfo.colorSpace || undefined;
      result.parts.p2pInfo.dimensionType = result.parts.p2pInfo.dimensionType || undefined;
      result.parts.p2pInfo.screenFormat = result.parts.p2pInfo.screenFormat || undefined;
      result.parts.p2pInfo.bitDepth = result.parts.p2pInfo.bitDepth || undefined;
      result.parts.p2pInfo.hybrid = result.parts.p2pInfo.hybrid || undefined;
      result.parts.p2pInfo.remux = result.parts.p2pInfo.remux || undefined;
      result.parts.p2pInfo.bdSize = result.parts.p2pInfo.bdSize || undefined;
      result.parts.p2pInfo.doVi = result.parts.p2pInfo.doVi || undefined;
      result.parts.p2pInfo.hdr10PlusProfile = result.parts.p2pInfo.hdr10PlusProfile || undefined;
      result.parts.p2pInfo.sdrType = result.parts.p2pInfo.sdrType || undefined;
      result.parts.p2pInfo.hardcodedSub = result.parts.p2pInfo.hardcodedSub || undefined;
      result.parts.p2pInfo.watermark = result.parts.p2pInfo.watermark || undefined;
      result.parts.p2pInfo.editVersion = result.parts.p2pInfo.editVersion || undefined;
      result.parts.p2pInfo.audioDescription = result.parts.p2pInfo.audioDescription || undefined;
      result.parts.p2pInfo.flacAudio = result.parts.p2pInfo.flacAudio || undefined;
      result.parts.p2pInfo.commentary = result.parts.p2pInfo.commentary || undefined;
      result.parts.p2pInfo.extras = result.parts.p2pInfo.extras || undefined;
      result.parts.p2pInfo.encoder = result.parts.p2pInfo.encoder || undefined;
    }

    // 预处理：尝试先识别片名
    this.extractTitle(fileName, result);

    
    // 应用所有规则
    let remainingText = fileName;
    let unrecognizedParts: string[] = [];
    
    // 如果识别到了片名，从剩余文本中移除
    // if (result.parts.title && result.titleMatchedText) {
    //   remainingText = remainingText.replace(result.titleMatchedText, ' ').trim();
    //   delete result.titleMatchedText; // 使用完后删除这个临时属性
    // }
    console.log('remainingText',remainingText)
    // 优先应用某些重要规则 - 从右向左匹配策略
    // 1. 发布组和容器后缀
    // 2. 音频/声道/Atmos标识
    // 3. HDR标识
    // 4. 视频编码
    // 5. 分辨率
    // 6. 来源
    // 7. 年份
    // 8. 版本/特殊标记
    // 9. 片名(最后处理)
    const priorityRules = [
      'release_group',      // 发布组
      'file_extension',     // 容器后缀
      'hybrid',             // Hybrid标签（添加到优先规则中）
      'year',               // 年份（最高优先级）
      'scene_tags',         // Scene标签（如LIMITED）
      'p2p_tags',           // P2P标签（如REMUX）
      'audio_codec',        // 音频编码
      'audio_channels',     // 声道布局
      'atmos_audio',        // Atmos音频
      'hdr',                // HDR标识
      'video_codec',        // 视频编码
      'resolution',         // 分辨率
      'source',             // 来源
      'streaming_platform', // 流媒体平台
      'version',            // 版本/特殊标记
      'season_episode',     // 季集信息(如果有)
      'season',             // 季数(如果有)
      'episode'             // 集数(如果有)
    ];
    for (const ruleId of priorityRules) {
      if (this.rules[ruleId]) {
        const rule = this.rules[ruleId];
        const match = rule.pattern.exec(remainingText);
        if (match) {
          // 提取匹配部分的信息
          const extractedParts = rule.extract(match);
          
          // 合并提取的信息到结果中
          result.parts = { ...result.parts, ...extractedParts };
          
          // 记录匹配的规则
          if (!result.matchedRules.includes(ruleId)) {
            result.matchedRules.push(ruleId);
          }

          // 从剩余文本中移除匹配部分
          remainingText = remainingText.replace(match[0], ' ').trim();
        }
      }
    }

    // 循环应用其余规则直到没有新的匹配
    let lastLength = -1;
    while (remainingText.length > 0 && remainingText.length !== lastLength) {
      lastLength = remainingText.length;
      let matched = false;
      

      // 尝试应用每个规则
      for (const ruleId in this.rules) {
        // 跳过已经应用过的优先规则
        if (priorityRules.includes(ruleId)) continue;
        
        const rule = this.rules[ruleId];
        const match = rule.pattern.exec(remainingText);

        if (match) {
          // 提取匹配部分的信息
          const extractedParts = rule.extract(match);
          
          // 合并提取的信息到结果中
          result.parts = { ...result.parts, ...extractedParts };
          
          // 记录匹配的规则
          if (!result.matchedRules.includes(ruleId)) {
            result.matchedRules.push(ruleId);
          }

          // 从剩余文本中移除匹配部分 - 确保这里正确替换
          const matchedText = match[0];
          console.log(`Rule ${ruleId} matched: "${matchedText}"`);
          remainingText = remainingText.replace(matchedText, ' ').trim();
          console.log(`Remaining text after match: "${remainingText}"`);
          matched = true;
          break;
        }
      }

      // 如果没有规则匹配，移除第一个单词并添加到未识别部分
      if (!matched && remainingText.length > 0) {
        const wordMatch = /^[\w\-]+/.exec(remainingText);
        if (wordMatch) {
          unrecognizedParts.push(wordMatch[0]);
          remainingText = remainingText.substring(wordMatch[0].length).trim();
        } else {
          // 如果没有匹配到单词，移除第一个字符
          unrecognizedParts.push(remainingText[0]);
          remainingText = remainingText.substring(1).trim();
        }
      }
    }

    // 如果有未识别的部分，添加到结果中
    if (unrecognizedParts.length > 0) {
      result.unrecognized = unrecognizedParts.join(' ');
    }

    // 处理标签
    if (result.parts.tags && typeof result.parts.tags === 'string') {
      result.parts.tags = [result.parts.tags];
    } else if (result.parts.tags && Array.isArray(result.parts.tags)) {
      // 确保标签是唯一的
      result.parts.tags = [...new Set(result.parts.tags)];
    }

    // 如果没有识别到片名，尝试从未识别部分提取
    if (!result.parts.title && result.unrecognized) {
      result.parts.title = {
        value: this.cleanupTitle(result.unrecognized),
        label: '片名',
        description: '从未识别部分提取的影片标题'
      };
      result.unrecognized = '';
    }

    return result;
  }

  /**
   * 尝试从文件名中提取片名 - 采用"从右向左"的匹配策略
   * @param fileName 文件名
   * @param result 解析结果
   */
  private extractTitle(fileName: string, result: ParseResult): void {
    // 如果已经通过其他规则提取到了片名，直接返回
    if (result.parts.title) {
      return;
    }
    
    // 使用"从右向左"的匹配策略提取片名
    let workingFileName = fileName;
    
    // 1. 先尝试匹配发布组
    const releaseGroupMatch = workingFileName.match(/-([A-Za-z0-9]+)(?:\.mkv|\.mp4|\.ts)?$/i);
    if (releaseGroupMatch) {
      workingFileName = workingFileName.substring(0, workingFileName.lastIndexOf(releaseGroupMatch[0]));
      if (!result.parts.releaseGroup) {
        result.parts.releaseGroup = releaseGroupMatch[1];
        if (!result.matchedRules.includes('release_group')) {
          result.matchedRules.push('release_group');
        }
      }
    }
    
    // 2. 移除流媒体平台标识
    const streamingPlatformMatch = workingFileName.match(/\.(NF|AMZN|DSNP|HULU|HBO|HMAX|iT|iPlayer|STAN|PCOK|ATVP|CRAV)\b/i);
    if (streamingPlatformMatch) {
      workingFileName = workingFileName.substring(0, workingFileName.lastIndexOf(streamingPlatformMatch[0])) + 
                        workingFileName.substring(workingFileName.lastIndexOf(streamingPlatformMatch[0]) + streamingPlatformMatch[0].length);
      if (!result.parts.streamingPlatform) {
        result.parts.streamingPlatform = streamingPlatformMatch[1];
        if (!result.matchedRules.includes('streaming_platform')) {
          result.matchedRules.push('streaming_platform');
        }
      }
    }
    
    // 3. 尝试匹配音频/声道/Atmos标识
    const audioMatch = workingFileName.match(/\.(Atmos|DTS-HD\.MA(?:\.\d+\.\d+)?|DDP?\d+\.\d+|AAC\d\.\d)\b/i);
    if (audioMatch) {
      workingFileName = workingFileName.substring(0, workingFileName.lastIndexOf(audioMatch[0])) + 
                        workingFileName.substring(workingFileName.lastIndexOf(audioMatch[0]) + audioMatch[0].length);
    }
    
    // 4. 尝试匹配HDR标识
    const hdrMatch = workingFileName.match(/\.(DV|HDR10\+?|HLG|Dolby\.Vision)\b/i);
    if (hdrMatch) {
      workingFileName = workingFileName.substring(0, workingFileName.lastIndexOf(hdrMatch[0])) + 
                        workingFileName.substring(workingFileName.lastIndexOf(hdrMatch[0]) + hdrMatch[0].length);
    }
    
    // 5. 尝试匹配视频编码
    const codecMatch = workingFileName.match(/\.(x?26[45]|H[._-]?26[45]|AV1|VP9|HEVC)\b/i);
    if (codecMatch) {
      workingFileName = workingFileName.substring(0, workingFileName.lastIndexOf(codecMatch[0])) + 
                        workingFileName.substring(workingFileName.lastIndexOf(codecMatch[0]) + codecMatch[0].length);
    }
    
    // 6. 尝试匹配分辨率
    const resolutionMatch = workingFileName.match(/\.(\d{3,4}p|[48]K)\b/i);
    if (resolutionMatch) {
      workingFileName = workingFileName.substring(0, workingFileName.lastIndexOf(resolutionMatch[0])) + 
                        workingFileName.substring(workingFileName.lastIndexOf(resolutionMatch[0]) + resolutionMatch[0].length);
    }
    
    // 7. 尝试匹配来源
    const sourceMatch = workingFileName.match(/\.(BluRay|WEB-DL?|HDTV|CAM|TS|TC|DVDRip)\b/i);
    if (sourceMatch) {
      workingFileName = workingFileName.substring(0, workingFileName.lastIndexOf(sourceMatch[0])) + 
                        workingFileName.substring(workingFileName.lastIndexOf(sourceMatch[0]) + sourceMatch[0].length);
    }
    
    // 8. 尝试匹配特殊标记
    const specialTagMatch = workingFileName.match(/\.(EXTENDED|IMAX|HYBRID|REPACK|PROPER|DC|REMUX)\b/i);
    if (specialTagMatch) {
      workingFileName = workingFileName.substring(0, workingFileName.lastIndexOf(specialTagMatch[0])) + 
                        workingFileName.substring(workingFileName.lastIndexOf(specialTagMatch[0]) + specialTagMatch[0].length);
    }
    
    // 9. 尝试匹配年份 - 这是关键步骤，年份通常是片名和技术信息的分界点
    const yearMatch = workingFileName.match(/(?:^|\.)(?:19\d{2}|20\d{2})\b/i);
    if (yearMatch) {
      // 提取年份前的内容作为片名
      const titlePart = workingFileName.substring(0, workingFileName.lastIndexOf(yearMatch[0]));
      result.parts.title = {
        value: this.cleanupTitle(titlePart),
        label: '片名',
        description: '影片的标题'
      };

      // 当成功识别片名后，确保返回识别到的片名文本，以便在parse方法中移除
      if (titlePart) {
        result.parts.title = {
          value: this.cleanupTitle(titlePart),
          label: '片名',
          description: '影片的标题'
        };
        result.titleMatchedText = titlePart; // 添加这个属性来标记匹配到的原始文本
      }
      
      // 记录年份信息
      if (!result.parts.year) {
        result.parts.year = {
          value: yearMatch[1],
          label: '年份',
          description: '影片的发行年份'
        };
      }
      
      if (!result.matchedRules.includes('year')) {
        result.matchedRules.push('year');
      }
      return;
    }
    
    // 10. 如果没有找到年份，尝试使用季集信息作为分界点
    const seasonEpisodeMatch = workingFileName.match(/\.(S\d{1,2}E\d{1,2}|Season\s*\d+\s*Episode\s*\d+)\b/i);
    if (seasonEpisodeMatch) {
      const titlePart = workingFileName.substring(0, workingFileName.lastIndexOf(seasonEpisodeMatch[0]));
      result.parts.title = {
        value: this.cleanupTitle(titlePart),
        label: '片名',
        description: '剧集的标题'
      };
      
      if (!result.matchedRules.includes('title_season_episode_heuristic')) {
        result.matchedRules.push('title_season_episode_heuristic');
      }
      return;
    }
    
    // 11. 如果以上都没匹配到，尝试使用第一个技术标识作为分界点
    const technicalMatch = workingFileName.match(/\.(1080p|2160p|720p|4K|UHD|BluRay|WEB-DL)\b/i);
    if (technicalMatch) {
      const titlePart = workingFileName.substring(0, workingFileName.lastIndexOf(technicalMatch[0]));
      result.parts.title = {
        value: this.cleanupTitle(titlePart),
        label: '片名',
        description: '影片的标题'
      };
      
      if (!result.matchedRules.includes('title_technical_heuristic')) {
        result.matchedRules.push('title_technical_heuristic');
      }
      return;
    }
    
    // 12. 如果还是没有匹配到，将整个剩余文本作为片名
    if (workingFileName) {
      result.parts.title = {
        value: this.cleanupTitle(workingFileName),
        label: '片名',
        description: '影片的标题'
      };
      
      if (!result.matchedRules.includes('title_fallback_heuristic')) {
        result.matchedRules.push('title_fallback_heuristic');
      }
    }
  }

  /**
   * 清理和格式化片名
   * @param title 原始片名
   * @returns 清理后的片名
   */
  private cleanupTitle(title: string): string {
    return title
      .replace(/\./g, ' ')  // 将点替换为空格
      .replace(/\s+/g, ' ') // 将多个空格替换为单个空格
      .trim();              // 去除首尾空格
  }

  /**
   * 获取规则详情
   * @param ruleId 规则ID
   * @returns 规则详情
   */
  getRuleDetails(ruleId: string): Rule | undefined {
    return this.rules[ruleId];
  }

  /**
   * 获取所有规则
   * @returns 所有规则
   */
  getAllRules(): RuleSet {
    return this.rules;
  }

  /**
   * 按类别获取规则
   * @param category 类别
   * @returns 该类别的规则
   */
  getRulesByCategory(category: string): RuleSet {
    const categoryRules: RuleSet = {};
    
    for (const ruleId in this.rules) {
      if (this.rules[ruleId].category === category) {
        categoryRules[ruleId] = this.rules[ruleId];
      }
    }
    
    return categoryRules;
  }
}