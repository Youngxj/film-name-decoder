import { ParseResult } from '../parsers/types';
import { FileNameParser } from '../parsers/fileNameParser';
import { parseFileExtension } from '../parsers/fileExtensionParser';
import { rules } from '../database/rules';
import { sourceExplanations, SourceExplanation } from '../database/sourceExplanations';

/**
 * 格式化解析结果，使其更易于展示
 * @param result 解析结果
 * @returns 格式化后的解析结果
 */
export function formatParseResult(result: ParseResult): Record<string, any> {
  const formatted: Record<string, any> = {
    originalFileName: result.originalFileName,
    parts: {},
    matchedRules: [],
    unrecognized: result.unrecognized || ''
  };

  // 格式化各个部分 - 按照12大类信息展示

  // 1. 标题 - 片名
  if (result.parts.title) {
    formatted.parts.title = {
      value: result.parts.title.value,
      label: '片名',
      description: '电影或剧集的标题',
      category: '基本信息'
    };
  }

  // 2. 年份
  if (result.parts.year) {
    formatted.parts.year = {
      value: result.parts.year.value,
      label: '年份',
      description: '影片的上映/上线年份',
      category: '基本信息'
    };
  }

  // 3. 版本类型
  if (result.parts.version) {
    formatted.parts.version = {
      value: result.parts.version,
      label: '版本类型',
      description: '如加长版、导演剪辑版、混合版、修正版等',
      category: '版本信息'
    };
  }

  // 4. 分辨率 - 清晰度
  if (result.parts.resolution) {
    formatted.parts.resolution = {
      value: result.parts.resolution.value,
      label: '分辨率',
      description: '视频的垂直像素或市场推广名称，如720p、1080p、2160p、4K等',
      category: '视频规格'
    };
  }

  // 5. 来源 - 片源渠道
  if (result.parts.source) {
    // 查找来源的中文解释
    const sourceValue = result.parts.source;
    const sourceExplanation = sourceExplanations[sourceValue];

    formatted.parts.source = {
      value: result.parts.source,
      label: '片源渠道',
      description: '视频的来源，如BluRay、WEB-DL、HDTV等',
      category: '来源信息',
      explanation: sourceExplanation || undefined
    };
  }

  // 流媒体平台 (来源的子类别)
  if (result.parts.streamingPlatform) {
    formatted.parts.streamingPlatform = {
      value: result.parts.streamingPlatform,
      label: '流媒体平台',
      description: '视频的流媒体平台来源，如Netflix(NF)、Amazon(AMZN)、Disney+(DSNP)等',
      category: '来源信息'
    };
  }

  // 6. 视频编码
  if (result.parts.videoCodec) {
    formatted.parts.videoCodec = {
      value: result.parts.videoCodec,
      label: '视频编码',
      description: '视频的编码格式，如H.264/AVC、H.265/HEVC、VP9、AV1等',
      category: '编码信息'
    };
  }

  // 7. 音频编码 - 音频格式
  if (result.parts.audioCodec) {
    formatted.parts.audioCodec = {
      value: result.parts.audioCodec,
      label: '音频编码',
      description: '音频的编码格式，如AAC、AC3/DD、DDP、DTS、TrueHD、Atmos等',
      category: '音频信息'
    };
  }

  // 8. 声道布局
  if (result.parts.audioChannels) {
    formatted.parts.audioChannels = {
      value: result.parts.audioChannels.value,
      label: '声道布局',
      description: '音频的通道数，如2.0(立体声)、5.1(环绕声)、7.1、Atmos(全景声)等',
      category: '音频信息'
    };
  }

  // 9. HDR信息 - 动态范围
  if (result.parts.hdr) {
    formatted.parts.hdr = {
      value: result.parts.hdr,
      label: 'HDR信息',
      description: '高动态范围视频信息，如HDR10、HDR10+、Dolby Vision(DV)、HLG等',
      category: '视频规格'
    };
  }

  // 10. 帧率/色深 - 高级参数
  if (result.parts.frameRate) {
    formatted.parts.frameRate = {
      value: result.parts.frameRate,
      label: '帧率',
      description: '视频的每秒帧数，如23.976fps、60fps等',
      category: '视频规格'
    };
  }

  if (result.parts.colorDepth) {
    formatted.parts.colorDepth = {
      value: result.parts.colorDepth,
      label: '色深',
      description: '视频的位深度，如8bit、10bit、12bit等',
      category: '视频规格'
    };
  }

  // 11. 发布组 - 压制/发布组
  if (result.parts.releaseGroup) {
    formatted.parts.releaseGroup = {
      value: result.parts.releaseGroup,
      label: '发布组',
      description: '发布影片的组织或个人，如SPARKS、RARBG、HONE等',
      category: '发布信息'
    };
  }

  // 12. 封装格式 - 容器
  // (fileExtension处理在下方)

  // 电视剧特有信息
  if (result.parts.season) {
    formatted.parts.season = {
      value: result.parts.season,
      label: '季数',
      description: '电视剧的季数',
      category: '剧集信息'
    };
  }

  if (result.parts.episode) {
    formatted.parts.episode = {
      value: result.parts.episode,
      label: '集数',
      description: '电视剧的集数',
      category: '剧集信息'
    };
  }

  // 其他信息
  if (result.parts.language) {
    formatted.parts.language = {
      value: result.parts.language,
      label: '语言',
      description: '视频的音频语言，如英语、中文等',
      category: '其他信息'
    };
  }

  if (result.parts.region) {
    formatted.parts.region = {
      value: result.parts.region,
      label: '地区',
      description: '视频的地区或国家，如US、UK、CN等',
      category: '其他信息'
    };
  }

  if (result.parts.subtitle) {
    formatted.parts.subtitle = {
      value: result.parts.subtitle.value,
      label: '字幕信息',
      description: '字幕相关信息，如中字、双语等',
      category: '其他信息'
    };
  }

  // Scene官方规范字段
  if (result.parts.sceneInfo) {
    const sceneInfo = result.parts.sceneInfo;
    const sceneValues = [];

    if (sceneInfo.proper) sceneValues.push('PROPER');
    if (sceneInfo.repack) sceneValues.push('REPACK');
    if (sceneInfo.readNfo) sceneValues.push('READ.NFO');
    if (sceneInfo.dirFix) sceneValues.push('DIRFIX');
    if (sceneInfo.nfoFix) sceneValues.push('NFOFIX');
    if (sceneInfo.reRip) sceneValues.push('RERIP');
    if (sceneInfo.dupe) sceneValues.push('DUPE');
    if (sceneInfo.subFix) sceneValues.push('SUBFIX');
    if (sceneInfo.dubbed) sceneValues.push(`DUBBED${sceneInfo.dubbed ? '-' + sceneInfo.dubbed : ''}`);
    if (sceneInfo.limited) sceneValues.push('LIMITED');
    if (sceneInfo.festival) sceneValues.push('FESTIVAL');
    if (sceneInfo.internal) sceneValues.push('INTERNAL');
    if (sceneInfo.stv) sceneValues.push('STV');
    if (sceneInfo.ppv) sceneValues.push('PPV');
    if (sceneInfo.complete) sceneValues.push('COMPLETE');
    if (sceneInfo.remastered) sceneValues.push('REMASTERED');
    if (sceneInfo.restored) sceneValues.push('RESTORED');
    if (sceneInfo.ws) sceneValues.push('WS');
    if (sceneInfo.fs) sceneValues.push('FS');
    if (sceneInfo.oar) sceneValues.push('OAR');
    if (sceneInfo.retail) sceneValues.push('RETAIL');
    if (sceneInfo.dvdr) sceneValues.push(sceneInfo.dvdr);
    if (sceneInfo.tvSystem) sceneValues.push(sceneInfo.tvSystem);
    if (sceneInfo.multi) sceneValues.push('MULTi');
    if (sceneInfo.multiSubs) sceneValues.push('MULTiSUBS');
    if (sceneInfo.subPack) sceneValues.push('SUBPACK');

    if (sceneValues.length > 0) {
      formatted.parts.sceneInfo = {
        value: sceneValues.join(', '),
        label: 'Scene规范标识',
        description: 'Scene官方规范中的特殊标识',
        category: '发布信息'
      };
    }
  }

  // P2P/Usenet扩展字段
  if (result.parts.p2pInfo) {
    const p2pInfo = result.parts.p2pInfo;
    // 创建一个新对象，过滤掉undefined值
    const filteredP2PInfo = Object.entries(p2pInfo).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    formatted.parts.p2pInfo = filteredP2PInfo;
  }
  console.log('result.parts.fileExtension', result.parts)

  if (result.parts.fileExtension) {
    // 文件扩展名现在已经是一个对象，包含value和explanation
    if (result.parts.fileExtension.value === '未指定') {
      formatted.parts.fileExtension = {
        value: '未指定',
        label: '文件格式',
        description: '文件没有明确的后缀名',
        details: null
      };
    } else {
      const extInfo = parseFileExtension(result.parts.fileExtension.value);
      console.log('extInfo', extInfo, result.parts.fileExtension)
      formatted.parts.fileExtension = {
        value: result.parts.fileExtension.value,
        label: '文件格式',
        description: extInfo ? extInfo.name : '文件的格式后缀',
        details: extInfo
      };
    }
  }

  if (result.parts.tags && Array.isArray(result.parts.tags)) {
    formatted.parts.tags = {
      value: result.parts.tags,
      label: '标签',
      description: '其他标识信息'
    };
  }

  // 格式化匹配的规则
  formatted.matchedRules = result.matchedRules.map(ruleId => {
    const rule = rules[ruleId];
    return {
      id: ruleId,
      name: rule ? rule.name : ruleId,
      description: rule ? rule.description : '',
      category: rule ? rule.category : '',
      examples: rule ? rule.examples : []
    };
  });

  return formatted;
}

/**
 * 解析文件名并格式化结果
 * @param fileName 文件名
 * @returns 格式化后的解析结果
 */
export function parseAndFormatFileName(fileName: string): Record<string, any> {
  const parser = new FileNameParser();
  console.log('fileName', fileName)
  const result = parser.parse(fileName);
  console.log('result2', result)
  return formatParseResult(result);
}

/**
 * 获取文件名中的各个部分
 * @param fileName 文件名
 * @returns 文件名中的各个部分
 */
export function getFileNameParts(fileName: string): string[] {
  // 按常见分隔符分割
  return fileName
    .replace(/\./g, ' ')
    .replace(/\[|\]|\(|\)|\{|\}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ');
}

/**
 * 高亮显示文件名中匹配的部分
 * @param fileName 原始文件名
 * @param matches 匹配信息数组，每个元素包含 pattern 和 type
 * @returns 带有高亮标记的文件名
 */
export function highlightMatches(
  fileName: string,
  matches: Array<{ pattern: RegExp; type: string }>
): Array<{ text: string; type: string | null }> {
  // 初始化结果数组
  const result: Array<{ text: string; type: string | null }> = [
    { text: fileName, type: null }
  ];

  // 对每个匹配模式进行处理
  matches.forEach(({ pattern, type }) => {
    // 创建新的结果数组
    const newResult: Array<{ text: string; type: string | null }> = [];

    // 处理当前结果数组中的每个片段
    result.forEach(segment => {
      // 如果片段已经有类型，直接添加到新结果中
      if (segment.type !== null) {
        newResult.push(segment);
        return;
      }

      // 在当前片段中查找匹配
      const text = segment.text;
      let lastIndex = 0;
      let match;

      // 重置正则表达式的lastIndex
      pattern.lastIndex = 0;

      // 查找所有匹配
      while ((match = pattern.exec(text)) !== null) {
        // 添加匹配前的文本
        if (match.index > lastIndex) {
          newResult.push({
            text: text.substring(lastIndex, match.index),
            type: null
          });
        }

        // 添加匹配的文本
        newResult.push({
          text: match[0],
          type
        });

        // 更新lastIndex
        lastIndex = match.index + match[0].length;

        // 如果正则表达式没有全局标志，手动增加lastIndex以避免无限循环
        if (!pattern.global) {
          break;
        }
      }

      // 添加最后一个匹配后的文本
      if (lastIndex < text.length) {
        newResult.push({
          text: text.substring(lastIndex),
          type: null
        });
      }
    });

    // 更新结果数组
    result.length = 0;
    result.push(...newResult);
  });

  return result;
}