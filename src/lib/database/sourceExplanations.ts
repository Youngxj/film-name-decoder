export interface SourceExplanation {
  name: string;        // 中文名称
  quality: string;     // 质量等级
  description: string; // 详细描述
  typical: string[];   // 典型特征
}

export const sourceExplanations: Record<string, SourceExplanation> = {
  'WEB-DL': {
    name: '网络下载版',
    quality: '高质量',
    description: '直接从流媒体服务商的服务器下载，无损画质，保留原始质量',
    typical: [
      '无水印',
      '无压缩痕迹',
      '通常有较高的比特率',
      '保留原始音频轨道'
    ]
  },
  'WEBRip': {
    name: '网络抓取版',
    quality: '中高质量',
    description: '从流媒体服务通过捕获视频流获得，可能有轻微质量损失',
    typical: [
      '可能有轻微压缩痕迹',
      '比特率略低于WEB-DL',
      '可能有轻微画质损失'
    ]
  },
  'BluRay': {
    name: '蓝光版',
    quality: '最高质量',
    description: '直接从蓝光光盘复制，最高质量，无损压缩',
    typical: [
      '极高比特率',
      '完整菜单和特效',
      '多音轨支持',
      '最佳画质表现'
    ]
  },
  'BDRip': {
    name: '蓝光转制版',
    quality: '高质量',
    description: '从蓝光光盘重新编码，保持高质量但文件更小',
    typical: [
      '高比特率但小于原始蓝光',
      '优化的文件大小',
      '保留大部分原始质量'
    ]
  },
  'HDRip': {
    name: '高清转制版',
    quality: '中高质量',
    description: '从高清源（如蓝光）转制，质量不如BDRip',
    typical: [
      '中等比特率',
      '可见的压缩痕迹',
      '适中的文件大小'
    ]
  },
  'DVDRip': {
    name: 'DVD转制版',
    quality: '中等质量',
    description: '从DVD光盘重新编码，标清质量',
    typical: [
      '标清分辨率',
      '中等比特率',
      '可能有轻微压缩痕迹'
    ]
  },
  'HDTV': {
    name: '高清电视录制版',
    quality: '中等质量',
    description: '从高清电视广播录制，质量取决于广播信号',
    typical: [
      '可能有台标水印',
      '可能有广告',
      '比特率不稳定',
      '可能有信号干扰'
    ]
  },
  'PDTV': {
    name: '纯数字电视录制版',
    quality: '中等质量',
    description: '从数字电视信号录制，比模拟信号质量好',
    typical: [
      '数字信号录制',
      '较少信号干扰',
      '可能有台标水印'
    ]
  },
  'CAM': {
    name: '枪版',
    quality: '低质量',
    description: '在电影院用摄像机录制，质量较差',
    typical: [
      '画面抖动',
      '背景噪音',
      '观众笑声和反应',
      '可能有人头阴影'
    ]
  },
  'TS': {
    name: '准枪版',
    quality: '低质量',
    description: '使用专业设备在电影院录制，质量比CAM好',
    typical: [
      '较少画面抖动',
      '仍有背景噪音',
      '画质不稳定'
    ]
  },
  'TC': {
    name: '胶片版',
    quality: '中低质量',
    description: '从电影胶片转录，质量比TS好',
    typical: [
      '较清晰的画面',
      '较少噪音',
      '可能有胶片划痕'
    ]
  },
  'HDTC': {
    name: '高清胶片版',
    quality: '中等质量',
    description: '高清版本的TC，画质更好',
    typical: [
      '高清分辨率',
      '较好的色彩表现',
      '可能有胶片划痕'
    ]
  },
  'SCR': {
    name: '样片版',
    quality: '中等质量',
    description: '电影公司发给评论人员的样片',
    typical: [
      '可能有水印',
      '可能有"仅供评论使用"字样',
      '质量参差不齐'
    ]
  },
  'DVD-Screener': {
    name: 'DVD样片版',
    quality: '中等质量',
    description: '发给评论人员的DVD样片',
    typical: [
      'DVD质量',
      '可能有水印',
      '可能有"仅供评论使用"字样'
    ]
  },
  'R5': {
    name: '区域5版本',
    quality: '中等质量',
    description: '来自俄罗斯区域5的DVD，通常比其他地区更早发布',
    typical: [
      '可能有俄语音轨',
      '质量接近零售DVD',
      '可能有硬编码字幕'
    ]
  },
  'TELESYNC': {
    name: '同步录制版',
    quality: '中低质量',
    description: '使用专业设备在空荡的电影院录制',
    typical: [
      '较少背景噪音',
      '画质比CAM好',
      '可能直接连接音频源'
    ]
  },
  'HC': {
    name: '硬字幕版',
    quality: '视源而定',
    description: '字幕被烧录到视频中，无法关闭',
    typical: [
      '固定字幕',
      '无法更换或关闭字幕',
      '质量取决于视频源'
    ]
  },
  'HQ': {
    name: '高质量版',
    quality: '高质量',
    description: '表示该版本经过特殊处理，质量较高',
    typical: [
      '高比特率',
      '优化的编码参数',
      '精心处理的音视频'
    ]
  },
  'HDR': {
    name: '高动态范围版本',
    quality: '高质量',
    description: '支持HDR技术，提供更宽的色彩范围和更高的亮度',
    typical: [
      '更广的色域',
      '更高的亮度范围',
      '更丰富的色彩表现'
    ]
  },
  'UHD': {
    name: '超高清版本',
    quality: '最高质量',
    description: '4K或更高分辨率的超高清版本',
    typical: [
      '4K或8K分辨率',
      '极高比特率',
      '通常支持HDR'
    ]
  },
  'Remux': {
    name: '无损重封装版',
    quality: '最高质量',
    description: '从原始媒体中提取视频/音频流并重新封装，无质量损失',
    typical: [
      '与原始媒体相同的视频质量',
      '无二次编码',
      '文件大小接近原始媒体'
    ]
  },
  'Encode': {
    name: '编码版',
    quality: '高质量',
    description: '经过重新编码以减小文件大小，保持较高质量',
    typical: [
      '优化的文件大小',
      '高效编码',
      '质量略低于Remux'
    ]
  },
  'Hybrid': {
    name: '混合版',
    quality: '高质量',
    description: '结合多个来源制作，取各家之长',
    typical: [
      '可能结合不同版本的视频和音频',
      '通常经过精心制作',
      '针对特定问题进行修复'
    ]
  },
  'iT': {
    name: '意大利版',
    quality: '视源而定',
    description: '来自意大利的发行版',
    typical: [
      '可能有意大利语音轨或字幕',
      '质量取决于视频源'
    ]
  },
  'HamiVideo': {
    name: '台湾Hami Video',
    quality: '高质量',
    description: '来自台湾Hami Video流媒体平台的内容',
    typical: [
      '台湾地区流媒体',
      '可能有繁体中文字幕',
      '质量接近WEB-DL'
    ]
  },
  'DV': {
    name: 'Dolby Vision',
    quality: '最高质量',
    description: '支持杜比视界HDR技术，提供动态元数据的HDR体验',
    typical: [
      '每帧动态调整HDR参数',
      '更精确的色彩和亮度控制',
      '需要支持DV的设备播放'
    ]
  },
  'HDR10+': {
    name: 'HDR10+',
    quality: '最高质量',
    description: '支持HDR10+技术，提供类似DV的动态元数据HDR体验',
    typical: [
      '动态元数据',
      '比普通HDR10更精确的色彩表现',
      '开放标准，兼容性更广'
    ]
  }
};