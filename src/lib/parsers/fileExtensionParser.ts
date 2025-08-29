/**
 * 文件后缀解析器
 * 用于解析和解释文件后缀名
 */

// 文件后缀信息类型
export interface FileExtensionInfo {
  extension: string;
  name: string;
  description: string;
  category: string;
  containerFormat?: string;
  typicalCodecs?: string[];
  pros?: string[];
  cons?: string[];
}

// 文件后缀数据库
export const fileExtensions: Record<string, FileExtensionInfo> = {
  'mkv': {
    extension: 'mkv',
    name: 'Matroska Video',
    description: '开源的多媒体容器格式，支持几乎所有的视频和音频编码，以及多字幕轨道',
    category: '视频',
    containerFormat: 'Matroska',
    typicalCodecs: ['H.264', 'H.265/HEVC', 'VP9', 'AV1', 'DTS', 'AC3', 'AAC', 'FLAC'],
    pros: ['支持几乎所有编码格式', '支持多音轨和多字幕', '支持章节标记', '开源格式'],
    cons: ['部分设备可能不支持', '文件体积可能较大']
  },
  'mp4': {
    extension: 'mp4',
    name: 'MPEG-4 Part 14',
    description: '基于QuickTime的常用视频容器格式，兼容性极佳',
    category: '视频',
    containerFormat: 'MPEG-4 Part 14',
    typicalCodecs: ['H.264', 'H.265/HEVC', 'AAC', 'AC3'],
    pros: ['几乎所有设备都支持', '流媒体友好', '文件体积适中'],
    cons: ['不如MKV灵活', '对特殊功能支持有限']
  },
  'avi': {
    extension: 'avi',
    name: 'Audio Video Interleave',
    description: '微软开发的较老的视频容器格式，兼容性好但功能有限',
    category: '视频',
    containerFormat: 'Audio Video Interleave',
    typicalCodecs: ['DivX', 'XviD', 'MPEG-4', 'MP3', 'AC3'],
    pros: ['广泛兼容旧设备', '简单易用'],
    cons: ['功能有限', '不支持最新编码', '文件体积通常较大']
  },
  'wmv': {
    extension: 'wmv',
    name: 'Windows Media Video',
    description: '微软开发的视频格式，主要用于Windows平台',
    category: '视频',
    containerFormat: 'Advanced Systems Format (ASF)',
    typicalCodecs: ['WMV', 'VC-1', 'WMA'],
    pros: ['Windows系统原生支持', 'DRM保护支持'],
    cons: ['跨平台兼容性差', '编码效率不如新格式']
  },
  'mov': {
    extension: 'mov',
    name: 'QuickTime Movie',
    description: '苹果开发的视频容器格式，在Mac和iOS设备上有良好支持',
    category: '视频',
    containerFormat: 'QuickTime',
    typicalCodecs: ['H.264', 'Apple ProRes', 'AAC'],
    pros: ['苹果设备原生支持', '专业视频编辑友好'],
    cons: ['在非苹果设备上兼容性可能有问题', '文件体积可能较大']
  },
  'flv': {
    extension: 'flv',
    name: 'Flash Video',
    description: '用于Adobe Flash Player的视频格式，曾广泛用于网络视频',
    category: '视频',
    containerFormat: 'Flash Video',
    typicalCodecs: ['VP6', 'H.264', 'AAC', 'MP3'],
    pros: ['流媒体友好', '文件体积小'],
    cons: ['Flash已被淘汰', '质量通常较低', '功能有限']
  },
  'm4v': {
    extension: 'm4v',
    name: 'MPEG-4 Video',
    description: '基本上是MP4的变种，主要用于iTunes和苹果设备',
    category: '视频',
    containerFormat: 'MPEG-4 Part 14',
    typicalCodecs: ['H.264', 'AAC'],
    pros: ['苹果设备原生支持', '可包含DRM保护'],
    cons: ['与MP4几乎相同，但兼容性略差']
  },
  'mpg': {
    extension: 'mpg',
    name: 'MPEG Video',
    description: '较老的MPEG-1或MPEG-2视频容器格式',
    category: '视频',
    containerFormat: 'MPEG Program Stream',
    typicalCodecs: ['MPEG-1', 'MPEG-2', 'MP2'],
    pros: ['广泛兼容旧设备', 'DVD视频标准格式'],
    cons: ['压缩效率低', '功能有限', '文件体积大']
  },
  'mpeg': {
    extension: 'mpeg',
    name: 'MPEG Video',
    description: '与MPG相同，是较老的MPEG-1或MPEG-2视频容器格式',
    category: '视频',
    containerFormat: 'MPEG Program Stream',
    typicalCodecs: ['MPEG-1', 'MPEG-2', 'MP2'],
    pros: ['广泛兼容旧设备', 'DVD视频标准格式'],
    cons: ['压缩效率低', '功能有限', '文件体积大']
  },
  'ts': {
    extension: 'ts',
    name: 'MPEG Transport Stream',
    description: '用于广播和流媒体的MPEG-2传输流格式',
    category: '视频',
    containerFormat: 'MPEG Transport Stream',
    typicalCodecs: ['H.264', 'H.265/HEVC', 'AAC', 'AC3'],
    pros: ['适合流媒体和直播', '错误恢复能力强', '支持多节目流'],
    cons: ['文件体积较大', '不适合本地存储']
  },
  'm2ts': {
    extension: 'm2ts',
    name: 'MPEG-2 Transport Stream',
    description: '蓝光光盘使用的MPEG-2传输流格式',
    category: '视频',
    containerFormat: 'MPEG Transport Stream',
    typicalCodecs: ['H.264', 'H.265/HEVC', 'DTS-HD', 'TrueHD', 'AC3'],
    pros: ['蓝光光盘标准格式', '高质量视频和音频', '支持高级功能'],
    cons: ['文件体积大', '兼容性不如MP4']
  },
  'webm': {
    extension: 'webm',
    name: 'WebM',
    description: '由Google开发的开源网络视频格式，基于Matroska容器',
    category: '视频',
    containerFormat: 'WebM (基于Matroska)',
    typicalCodecs: ['VP8', 'VP9', 'AV1', 'Opus', 'Vorbis'],
    pros: ['开源免版税', '网页视频友好', '文件体积小'],
    cons: ['不支持某些传统编码', '旧设备兼容性差']
  },
  'rm': {
    extension: 'rm',
    name: 'RealMedia',
    description: 'RealNetworks开发的旧式流媒体格式',
    category: '视频',
    containerFormat: 'RealMedia',
    typicalCodecs: ['RealVideo', 'RealAudio'],
    pros: ['流媒体优化', '低带宽友好'],
    cons: ['质量通常较低', '已基本淘汰', '需要专用播放器']
  },
  '3gp': {
    extension: '3gp',
    name: '3GPP Multimedia',
    description: '为3G移动电话设计的简化版MPEG-4格式',
    category: '视频',
    containerFormat: '3GPP',
    typicalCodecs: ['H.263', 'MPEG-4', 'AAC', 'AMR'],
    pros: ['移动设备友好', '文件体积小'],
    cons: ['质量通常较低', '功能有限', '主要用于旧手机']
  },
  'srt': {
    extension: 'srt',
    name: 'SubRip Subtitle',
    description: '最常用的文本字幕格式，包含时间码和文本',
    category: '字幕',
    pros: ['简单易用', '广泛支持', '易于编辑'],
    cons: ['不支持样式', '不支持图形']
  },
  'ass': {
    extension: 'ass',
    name: 'Advanced SubStation Alpha',
    description: '高级字幕格式，支持复杂样式和动画效果',
    category: '字幕',
    pros: ['支持复杂样式', '支持动画', '精确定位'],
    cons: ['复杂度高', '部分播放器支持有限']
  },
  'idx': {
    extension: 'idx',
    name: 'VobSub Index',
    description: 'DVD字幕索引文件，与.sub文件配合使用',
    category: '字幕',
    pros: ['保留DVD原始字幕', '支持图形'],
    cons: ['需要配套.sub文件', '不易编辑', '体积大']
  },
  'sub': {
    extension: 'sub',
    name: 'VobSub Subtitle',
    description: 'DVD字幕数据文件，与.idx文件配合使用',
    category: '字幕',
    pros: ['保留DVD原始字幕', '支持图形'],
    cons: ['需要配套.idx文件', '不易编辑', '体积大']
  }
};

/**
 * 解析文件后缀
 * @param extension 文件后缀（不含点）
 * @returns 文件后缀信息
 */
export function parseFileExtension(extension: string): FileExtensionInfo | undefined {
  if (!extension) return undefined;
  
  // 转换为小写并去除前导点
  const normalizedExt = extension.toLowerCase().replace(/^\./, '');
  
  return fileExtensions[normalizedExt];
}

/**
 * 获取所有文件后缀信息
 * @returns 所有文件后缀信息
 */
export function getAllFileExtensions(): FileExtensionInfo[] {
  return Object.values(fileExtensions);
}

/**
 * 按类别获取文件后缀信息
 * @param category 类别
 * @returns 该类别的文件后缀信息
 */
export function getFileExtensionsByCategory(category: string): FileExtensionInfo[] {
  return Object.values(fileExtensions).filter(ext => ext.category === category);
}