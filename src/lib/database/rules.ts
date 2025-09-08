import { RuleSet } from '../parsers/types';

/**
 * 获取容器格式的解释说明
 * @param extension 文件扩展名
 * @returns 对应容器格式的解释
 */
function getContainerExplanation(extension: string): string {
  const explanations: Record<string, string> = {
    'mkv': 'Matroska视频容器，支持多音轨、字幕和章节',
    'mp4': 'MPEG-4容器，兼容性好，广泛支持',
    'avi': '音视频交错格式，较旧但兼容性好',
    'wmv': 'Windows媒体视频格式，微软开发',
    'flv': 'Flash视频格式，适合网络流媒体',
    'mov': 'QuickTime影片格式，苹果开发',
    'm4v': 'iTunes视频格式，基于MP4',
    'mpg': 'MPEG-1或MPEG-2视频格式',
    'mpeg': 'MPEG标准视频格式',
    'ts': 'MPEG传输流，用于广播',
    'm2ts': 'Blu-ray BDAV容器格式'
  };
  
  return explanations[extension] || `${extension}格式容器`;
}

/**
 * 影视文件命名规则库
 * 包含各种常见的影视文件命名规则和解释
 */
export const rules: RuleSet = {
  // 片名规则 - 增强
  'title': {
    id: 'title',
    name: '片名',
    description: '影片的标题，通常位于文件名的开头，由英文字母、数字和特殊字符组成，单词间通常用点或空格分隔',
    category: '基本信息',
    pattern: /^([A-Za-z0-9][\w\.\-]*(?:[\.\s][\w\.\-]+)*)(?=[\.\s]+(19\d{2}|20\d{2}|S\d{2}|E\d{2}|Hybrid|WEB-?DL|BluRay))/i,
    examples: ['The.Matrix.1999', 'Inception.2010', 'Breaking.Bad.S01', 'Final.Destination.Bloodlines.2025'],
    extract: (match) => ({ 
      title: {
        value: match[1].replace(/\./g, ' '),
        label: '片名',
        description: '影片的标题'
      }
    })
  },
  
  // 复杂片名规则 - 新增
  'complex_title': {
    id: 'complex_title',
    name: '复杂片名',
    description: '更复杂的影片标题匹配，适用于包含多个单词的长片名',
    category: '基本信息',
    pattern: /^([A-Za-z0-9\p{Script=Han}][\w\.\-\p{Script=Han}]*(?:[\.\s\-_][\w\.\-\p{Script=Han}]+)*)(?=[\.\s\-_]+(19\d{2}|20\d{2}|S\d{2}|E\d{2}|Hybrid|WEB-?DL|BluRay|1080[pi]|720[pi]|2160[pi]|4K))/iu,
    examples: ['Final.Destination.Bloodlines.2025', 'The.Lord.of.the.Rings.The.Fellowship.of.the.Ring.2001'],
    extract: (match) => ({ title: {
        value: match[1].replace(/\./g, ' '),
        label: '片名',
        description: '影片的标题'
      }
    })
  },

  // 年份规则
  'year': {
    id: 'year',
    name: '年份',
    description: '影片的发行年份，通常在标题后面的括号中',
    category: '基本信息',
    pattern: /[.\s\[\(\-_]+(19\d{2}|20\d{2})(?:[.\s\]\)\-_]|$)/i,
    examples: ['Movie.Name.2020.1080p', 'Movie Name (2020) 1080p', 'Movie.Name.[2020].1080p'],
    extract: (match) => ({ 
      year: {
        value: match[1],
        label: '年份',
        description: '影片的发行年份'
      }
    })
  },
  
  // 季数规则
  'season': {
    id: 'season',
    name: '季数',
    description: '电视剧的季数，通常表示为S01、Season 1等形式',
    category: '剧集信息',
    pattern: /[\.\s]+(S|Season\s*)(\d{1,2})[\.\s]+/i,
    examples: ['Show.Name.S01.1080p', 'Show Name Season 1 1080p'],
    extract: (match) => ({ season: match[2] })
  },
  
  // 集数规则
  'episode': {
    id: 'episode',
    name: '集数',
    description: '电视剧的集数，通常表示为E01、Episode 1等形式',
    category: '剧集信息',
    pattern: /[\.\s]+(E|Episode\s*)(\d{1,3})[\.\s]+/i,
    examples: ['Show.Name.S01E01.1080p', 'Show Name S01 Episode 1 1080p'],
    extract: (match) => ({ episode: match[2] })
  },
  
  // 季集合并规则
  'season_episode': {
    id: 'season_episode',
    name: '季集合并',
    description: '电视剧的季数和集数合并表示，如S01E01',
    category: '剧集信息',
    pattern: /[\.\s]+(S(\d{1,2})E(\d{1,3}))[\.\s]+/i,
    examples: ['Show.Name.S01E01.1080p', 'Show Name S01E01 1080p'],
    extract: (match) => ({ season: match[2], episode: match[3] })
  },
  
  // 分辨率规则
  'resolution': {
    id: 'resolution',
    name: '分辨率',
    description: '视频的分辨率，如720p、1080p、2160p、4K等',
    category: '视频质量',
    pattern: /[\.\s\-_]+(720[pi]|1080[pi]|2160[pi]|4K|UHD|HD|FHD|QHD|SD|LD|38\d{2}x21\d{2}|19\d{2}x10\d{2}|12\d{2}x7\d{2}|8\d{2}x4\d{2}|6\d{2}x3\d{2}|4\d{2}x2\d{2}|2\d{2}x1\d{2}|540[pi]|640[pi]|960[pi]|1280[pi]|1600[pi]|1920[pi]|2048[pi]|2560[pi]|3200[pi]|3840[pi]|4096[pi]|5120[pi]|6144[pi]|7680[pi]|8192[pi]|WVGA|WXGA|WUXGA|WQXGA|WQHD|WSXGA|WQSXGA|WHUXGA|WHSXGA)[\.\s\-_]+/i,
    examples: ['Movie.Name.2020.1080p', 'Movie Name 2020 4K', 'Movie.Name.2020.FHD', 'Movie.Name.2020.3840x2160', 'Movie.Name.2020.WQHD'],
    extract: (match) => ({ 
      resolution: {
        value: match[1],
        label: '分辨率',
        description: '视频的分辨率规格'
      }
    })
  },
  
  // 视频编码规则 - 进一步增强
  'video_codec': {
    id: 'video_codec',
    name: '视频编码',
    description: '视频的编码格式，如x264、x265、HEVC、AVC等',
    category: '视频编码',
    pattern: /[.\s\-_\[\(](H[.\s]?265|H[.\s]?264|HEVC|x265|x264|AVC|XVID|DIVX|VP[89]|AV1|MPEG[.\s]?[24])(?:[.\s\-_\]\)]|$)/i,
    examples: ['Movie.Name.2020.1080p.x264', 'Movie Name 2020 1080p HEVC', 'H.265', 'H 264'],
    extract: (match) => ({ videoCodec: match[1].replace(/[\.\s]/g, '') })
  },
  
  // H.265编码规则 - 增强
  'h265_codec': {
    id: 'h265_codec',
    name: 'H.265编码',
    description: 'H.265视频编码格式，也称为HEVC',
    category: '视频编码',
    pattern: /[\.\s\-_]+H\.265(?:[\.\s\-_]|$)/i,
    examples: ['Movie.Name.2020.1080p.H.265', 'Movie Name 2020 1080p H.265'],
    extract: (match) => ({ videoCodec: 'H.265' })
  },
  
  // H.264编码规则 - 新增
  'h264_codec': {
    id: 'h264_codec',
    name: 'H.264编码',
    description: 'H.264视频编码格式，也称为AVC',
    category: '视频编码',
    pattern: /[\.\s]+H\.264[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.H.264', 'Movie Name 2020 1080p H.264', 'Doctor.X.the.Movie.2024.1080p.HamiVideo.WEB-DL.AAC2.0.H.264-DreamHD'],
    extract: (match) => ({ videoCodec: 'H.264' })
  },
  
  // 高级视频编码规则 - 新增
  'advanced_video_codec': {
    id: 'advanced_video_codec',
    name: '高级视频编码',
    description: '更复杂的视频编码格式表示方式',
    category: '视频编码',
    pattern: /[\.\s]+([HXh][\.\s]?26[45][\.\s\-]?(?:10bit|8bit|Main|High|Profile)?)[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.H.265-10bit', 'Movie Name 2020 1080p x264-High'],
    extract: (match) => ({ videoCodec: match[1].replace(/[\.\s]/g, '') })
  },
  
  // 音频编码规则 - 增强
  'audio_codec': {
    id: 'audio_codec',
    name: '音频编码',
    description: '音频的编码格式，如AAC、AC3、DTS、FLAC等',
    category: '音频编码',
    pattern: /[\.\s\-]+(DDP\.5\.1\.Atmos|DDP\.5\.1|DDP|AAC|AC3|DTS-X|DTS|DTS[\.\s\-]HD|TrueHD|FLAC|MP3|Atmos|DD[\.\s]?5[\.\s]?1|DD\+|EAC3)[\.\s\-]+/i,
    examples: ['Movie.Name.2020.1080p.x264.DTS', 'Movie Name 2020 1080p AC3', 'DDP.5.1', 'DD 5.1'],
    extract: (match) => ({ audioCodec: match[1] })
  },
  
  // 高级音频编码规则 - 新增
  'advanced_audio_codec': {
    id: 'advanced_audio_codec',
    name: '高级音频编码',
    description: '复杂的音频编码格式，如DDP.5.1.Atmos',
    category: '音频编码',
    pattern: /[.\s\-_\[\(](DDP[.\s]?5[.\s]?1[.\s]?Atmos|DD\+[.\s]?5[.\s]?1[.\s]?Atmos|DTS-HD[.\s]?MA|DTS-X|DTS[.\s]?X|TrueHD[.\s]?Atmos)(?:[.\s\-_\]\)]|$)/i,
    examples: ['Movie.Name.2020.1080p.DDP.5.1.Atmos', 'Movie Name 2020 1080p TrueHD.Atmos'],
    extract: (match) => ({ audioCodec: match[1] })
  },
  
  // 发布组规则
  'release_group': {
    id: 'release_group',
    name: '发布组',
    description: '发布影片的组织或个人，通常在文件名的最后用破折号或方括号标识',
    category: '发布信息',
    pattern: /([\-\[])([A-Za-z0-9][\w\-\.]{0,20})[\]\-](?:$|\.(?:mkv|mp4|avi|ts|m2ts)$)/i,
    examples: ['Movie.Name.2020.1080p-RARBG', 'Movie.Name.2020.1080p.[YTS]'],
    extract: (match) => ({ releaseGroup: match[2] })
  },
  
  // 字幕信息规则
  'subtitle': {
    id: 'subtitle',
    name: '字幕信息',
    description: '字幕相关信息，如硬字幕、中字、双语等',
    category: '字幕信息',
    pattern: /[\.\s\-_]*(HC|HARDSUB|中字|简中|繁中|双语|中英|CHT|CHS|SUBBED)[\.\s\-_]*/i,
    examples: ['Movie.Name.2020.1080p.中字', 'Movie Name 2020 1080p HC'],
    extract: (match) => ({ subtitle: {
      value: match[1],
      label: '字幕信息',
      description: '字幕相关信息，如中字、双语等',
    }})
  },
  
  // 版本信息规则
  'version': {
    id: 'version',
    name: '版本信息',
    description: '影片的版本信息，如导演剪辑版、加长版等',
    category: '版本信息',
    pattern: /[\.\s]+(Directors\.Cut|Extended|UNRATED|REMASTERED|PROPER|RERIP|REMUX|CRITERION)[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.Directors.Cut', 'Movie Name 2020 1080p EXTENDED'],
    extract: (match) => ({ version: match[1] })
  },
  
  // 来源规则 - 增强
  'source': {
    id: 'source',
    name: '视频来源',
    description: '视频的来源，如WEB-DL、BluRay、HDTV等',
    category: '来源信息',
    pattern: /[.\s\-_\[\(](WEB[.\s\-_]?DL|WEB[.\s\-_]?Rip|BluRay|BDRip|BRRip|DVD[.\s\-_]?Rip|HDTV|HDRip|Blu[.\s\-_]?Ray|Hybrid|Remux|TELE[.\s\-_]?SYNC|TS|TC|CAM|HDCAM|HDRIP|WEBDL|WEBRIP|AMZN|NETFLIX|HULU|DISNEY)(?:[.\s\-_\]\)]|$)/i,
    examples: ['Movie.Name.2020.1080p.WEB-DL', 'Movie.Name.2020.1080p.BluRay', 'Movie.Name.2020.1080p.HDTV'],
    extract: (match) => ({ source: match[1] })
  },
  
  // 特定WEB-DL来源规则 - 新增
  'webdl_source': {
    id: 'webdl_source',
    name: 'WEB-DL来源',
    description: '特定的WEB-DL来源格式',
    category: '来源信息',
    pattern: /[\.\s]+WEB[\.\s\-]DL[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.WEB-DL', 'Movie.Name.2020.1080p.WEB.DL'],
    extract: (match) => ({ source: 'WEB-DL' })
  },
  
  // 流媒体平台规则 - 新增
  'streaming_platform': {
    id: 'streaming_platform',
    name: '流媒体平台',
    description: '视频的流媒体平台来源，如Netflix、Amazon、Disney+等',
    category: '来源信息',
    pattern: /[\.\s]+(NF|AMZN|DSNP|HULU|HBO|HMAX|iT|iPlayer|STAN|PCOK|ATVP|CRAV)[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.NF.WEB-DL', 'Movie.Name.2020.1080p.AMZN.WEB-DL'],
    extract: (match) => ({ streamingPlatform: match[1] })
  },
  
  // DVD来源规则
  'dvd_source': {
    id: 'dvd_source',
    name: 'DVD来源',
    description: '来自DVD光盘的影片，如DVDRip、DVD5等',
    category: '来源信息',
    pattern: /[\.\s]+(DVDRip|DVD-?Scr|DVD5|DVD9|DVD-R)[\.\s]+/i,
    examples: ['Movie.Name.2020.DVDRip', 'Movie Name 2020 DVD-Scr'],
    extract: (match) => ({ tags: [match[1]] })
  },
  
  // 电视录制规则
  'tv_source': {
    id: 'tv_source',
    name: '电视录制',
    description: '从电视信号录制的影片，如HDTV、PDTV等',
    category: '来源信息',
    pattern: /[\.\s]+(HDTV|PDTV|DSR|DTH|TVRip)[\.\s]+/i,
    examples: ['Show.Name.S01E01.HDTV', 'Show Name S01E01 PDTV'],
    extract: (match) => ({ tags: [match[1]] })
  },
  
  // 高级HDR信息规则 - 增强
  'hdr': {
    id: 'hdr',
    name: 'HDR信息',
    description: '高动态范围视频信息，如HDR10、Dolby Vision等',
    category: '视频质量',
    pattern: /[\.\s\-]+(HDR10\+?|DV\.HDR10\+|HDR|DoVi|Dolby[\.\s]?Vision|DV)[\.\s\-]+/i,
    examples: ['Movie.Name.2020.2160p.HDR10', 'Movie Name 2020 4K DoVi', 'Dolby.Vision'],
    extract: (match) => ({ hdr: match[1].replace(/\./g, ' ') })
  },
  
  // 音频通道规则 - 新增
  'audio_channels': {
    id: 'audio_channels',
    name: '音频通道',
    description: '音频的通道数，如2.0、5.1、7.1等',
    category: '音频编码',
    pattern: /[\.\s]+(\d[\.\s]?\d(?:ch)?)[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.5.1', 'Movie Name 2020 1080p 7.1ch'],
    extract: (match) => ({ audioChannels: {
      value: match[1],
      label: '声道布局',
      description: '音频的通道数，如2.0(立体声)、5.1(环绕声)、7.1、Atmos(全景声)等',
    }})
  },
  
  // 特定音频编码通道规则 - 新增
  'specific_audio_codec_channels': {
    id: 'specific_audio_codec_channels',
    name: '特定音频编码通道',
    description: '特定的音频编码和通道组合，如AAC2.0',
    category: '音频编码',
    pattern: /[\.\s]+(AAC[\.\s]?2[\.\s]?0|DTS[\.\s]?5[\.\s]?1|AC3[\.\s]?5[\.\s]?1)[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.AAC2.0', 'Movie Name 2020 1080p DTS5.1', 'Doctor.X.the.Movie.2024.1080p.HamiVideo.WEB-DL.AAC2.0.H.264-DreamHD'],
    extract: (match) => ({ 
      audioCodecChannels: {
        value: match[1].replace(/[\.\s]/g, ''),
        label: '音频编码通道',
        description: '特定的音频编码和通道组合'
      }
    })
  },
  
  // 文件后缀规则 - 增强
  'file_extension': {
    id: 'file_extension',
    name: '文件后缀',
    description: '文件的格式后缀，如.mkv、.mp4等',
    category: '文件信息',
    pattern: /\.(mkv|mp4|avi|wmv|flv|mov|m4v|mpg|mpeg|ts|m2ts)$/i,
    examples: ['Movie.Name.2020.1080p.mkv', 'Movie Name 2020 1080p.mp4'],
    extract: (match) => ({ 
      fileExtension: {
        value: match[1].toLowerCase(),
        explanation: getContainerExplanation(match[1].toLowerCase())
      }
    })
  },
  
  // 可选文件后缀规则 - 新增
  // 'optional_file_extension': {
  //   id: 'optional_file_extension',
  //   name: '可选文件后缀',
  //   description: '处理没有文件后缀的情况',
  //   category: '文件信息',
  //   pattern: /$/,
  //   examples: ['Movie.Name.2020.1080p', 'Movie Name 2020 1080p'],
  //   extract: () => ({ 
  //     fileExtension: {
  //       value: '未指定',
  //       explanation: '文件没有指定扩展名'
  //     }
  //   })
  // },
  
  // 特殊标签规则 - 增强
  'special_tags': {
    id: 'special_tags',
    name: '特殊标签',
    description: '特殊的标识标签，如完结、合集等',
    category: '其他信息',
    pattern: /[\.\s]+(Complete|Collection|Trilogy|Duology|Boxset|COMPLETE|REPACK|PROPER|EXTENDED|UNRATED|THEATRICAL|IMAX|OP|ED|NCED|NCOP|OVA|SP|PV|OVA|OVB)[\.\s]+/i,
    examples: ['Show.Name.Complete.1080p', 'Movie Name Trilogy 1080p', 'Movie.REPACK.1080p'],
    extract: (match) => ({ tags: [match[1]] })
  },
  
  // 语言规则 - 新增
  'language': {
    id: 'language',
    name: '语言',
    description: '视频的音频语言，如英语、中文等',
    category: '语言信息',
    pattern: /[\.\s]+(Multi|Multilingual|English|Chinese|Spanish|French|German|Italian|Japanese|Korean|Russian)[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.Multi', 'Movie Name 2020 1080p English'],
    extract: (match) => ({ language: match[1] })
  },
  
  // 地区规则 - 新增
  'region': {
    id: 'region',
    name: '地区',
    description: '视频的地区或国家，如US、UK、CN等',
    category: '地区信息',
    pattern: /[\.\s]+(US|UK|CN|JP|KR|FR|DE|IT|ES|RU)[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.US', 'Movie Name 2020 1080p UK'],
    extract: (match) => ({ region: match[1] })
  },
  
  // 混合标签规则 - 新增
  'hybrid': {
    id: 'hybrid',
    name: '混合标签',
    description: '表示视频使用了多种来源或技术的混合',
    category: '其他信息',
    pattern: /[\.\s\-_]+Hybrid(?:[\.\s\-_]|$)/i,
    examples: ['Movie.Name.2020.1080p.Hybrid.BluRay', 'Movie Name 2020 1080p Hybrid WEB-DL'],
    extract: (match) => ({ tags: ['Hybrid'] })
  },
  
  // 复杂组合规则 - 新增
  'complex_combination': {
    id: 'complex_combination',
    name: '复杂组合',
    description: '识别复杂的编码和格式组合',
    category: '音频编码',
    pattern: /[.\s\-_\[\(](DDP[.\s]?5[.\s]?1[.\s]?Atmos|DDP[.\s]?5[.\s]?1|DDP|AAC|AC[.\s]?3|DTS[.\s\-]?(?:HD|MA|X)?|TrueHD|FLAC|MP3|Atmos|DD[.\s]?(?:5[.\s]?1)?|DD\+|EAC3|PCM|LPCM)(?:[.\s\-_\]\)]|$)/i,
    examples: ['Movie.Name.2020.2160p.DDP.5.1.Atmos', 'Movie.Name.2020.2160p.DV.HDR10+'],
    extract: (match) => ({ 
      p2pInfo: { 
        formatCombination: match[1].replace(/[\.\s]/g, ' ').trim() 
      } 
    })
  },
  
  // 帧率规则 - 新增
  'frame_rate': {
    id: 'frame_rate',
    name: '帧率',
    description: '视频的每秒帧数',
    category: '视频规格',
    pattern: /[\.\s]+((?:23\.976|24|25|30|50|60|120)fps)[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.60fps', 'Movie.Name.2020.1080p.23.976fps'],
    extract: (match) => ({ frameRate: match[1] })
  },
  
  // 色深规则 - 新增
  'color_depth': {
    id: 'color_depth',
    name: '色深',
    description: '视频的位深度',
    category: '视频规格',
    pattern: /[\.\s]+((?:8|10|12)bit)[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.10bit', 'Movie.Name.2020.1080p.8bit'],
    extract: (match) => ({ colorDepth: match[1] })
  },
  
  // 色域规则 - 新增
  'color_space': {
    id: 'color_space',
    name: '色域',
    description: '视频的色彩空间',
    category: '视频规格',
    pattern: /[\.\s]+(BT[\.\s]?(?:709|2020)|Rec[\.\s]?(?:709|2020))[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.BT.709', 'Movie.Name.2020.2160p.BT.2020'],
    extract: (match) => ({ 
      p2pInfo: { 
        colorSpace: match[1].replace(/[\.\s]/g, '.') 
      } 
    })
  },
  
  // 立体格式规则 - 新增
  'dimension_type': {
    id: 'dimension_type',
    name: '立体格式',
    description: '视频的立体格式',
    category: '视频规格',
    pattern: /[\.\s]+(3D|HSBS|HTAB|2D)[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.3D', 'Movie.Name.2020.1080p.3D.HSBS'],
    extract: (match) => ({ 
      p2pInfo: { 
        dimensionType: match[1] 
      } 
    })
  },
  
  // 画幅版本规则 - 新增
  'screen_format': {
    id: 'screen_format',
    name: '画幅版本',
    description: '视频的画幅版本',
    category: '视频规格',
    pattern: /[\.\s]+(Open[\.\s]?Matte|IMAX[\.\s]?Enhanced|IMAX)[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.Open.Matte', 'Movie.Name.2020.1080p.IMAX.Enhanced'],
    extract: (match) => ({ 
      p2pInfo: { 
        screenFormat: match[1].replace(/[\.\s]/g, '.') 
      } 
    })
  },
  
  // 硬字幕版本规则 - 新增
  'hardcoded_sub': {
    id: 'hardcoded_sub',
    name: '硬字幕版本',
    description: '带有硬编码字幕的视频',
    category: '字幕信息',
    pattern: /[\.\s]+(HC|KORSUB|HC[\.\s]?HDRip)[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.HC', 'Movie.Name.2020.1080p.KORSUB'],
    extract: (match) => ({ 
      p2pInfo: { 
        hardcodedSub: match[1].replace(/[\.\s]/g, '.') 
      } 
    })
  },
  
  // 水印规则 - 新增
  'watermark': {
    id: 'watermark',
    name: '水印',
    description: '视频是否有水印',
    category: '视频质量',
    pattern: /[\.\s]+(CLEAN|DIRTY)[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.CLEAN', 'Movie.Name.2020.1080p.DIRTY'],
    extract: (match) => ({ 
      p2pInfo: { 
        watermark: match[1] 
      } 
    })
  },
  
  // 剪辑版本规则 - 新增
  'edit_version': {
    id: 'edit_version',
    name: '剪辑版本',
    description: '视频的剪辑版本',
    category: '版本信息',
    pattern: /[\.\s]+(FanEdit|EXTENDED[\.\s]?EDITION|THEATRICAL[\.\s]?CUT|DIRECTOR'?S[\.\s]?CUT)[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.FanEdit', 'Movie.Name.2020.1080p.EXTENDED.EDITION'],
    extract: (match) => ({ 
      p2pInfo: { 
        editVersion: match[1].replace(/[\.\s]/g, '.') 
      } 
    })
  },
  
  // 音频描述规则 - 新增
  'audio_description': {
    id: 'audio_description',
    name: '音频描述',
    description: '带有音频描述的视频',
    category: '音频信息',
    pattern: /[\.\s]+(AD|AAC[\.\s]?AD)[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.AD', 'Movie.Name.2020.1080p.AAC-AD'],
    extract: (match) => ({ 
      p2pInfo: { 
        audioDescription: true 
      } 
    })
  },
  
  // 无损音轨规则 - 新增
  'flac_audio': {
    id: 'flac_audio',
    name: '无损音轨',
    description: '带有FLAC无损音轨的视频',
    category: '音频信息',
    pattern: /[\.\s]+(FLAC[\.\s]?(?:2\.0|5\.1|7\.1))[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.FLAC.2.0', 'Movie.Name.2020.1080p.FLAC.5.1'],
    extract: (match) => ({ 
      p2pInfo: { 
        flacAudio: match[1].replace(/[\.\s]/g, '.') 
      } 
    })
  },
  
  // 评论轨规则 - 新增
  'commentary': {
    id: 'commentary',
    name: '评论轨',
    description: '带有导演或演员评论轨的视频',
    category: '音频信息',
    pattern: /[\.\s]+(Commentary|With[\.\s]?Commentary)[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.Commentary', 'Movie.Name.2020.1080p.With.Commentary'],
    extract: (match) => ({ 
      p2pInfo: { 
        commentary: true 
      } 
    })
  },
  
  // 花絮特典规则 - 新增
  'extras': {
    id: 'extras',
    name: '花絮特典',
    description: '带有花絮或特典的视频',
    category: '其他信息',
    pattern: /[\.\s]+(Extras|Bonus[\.\s]?Disc)[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.Extras', 'Movie.Name.2020.1080p.Bonus.Disc'],
    extract: (match) => ({ 
      p2pInfo: { 
        extras: true 
      } 
    })
  },
  
  // 压制者署名规则 - 新增
  'encoder': {
    id: 'encoder',
    name: '压制者署名',
    description: '视频的压制者署名',
    category: '发布信息',
    pattern: /[\.\s]+x265[\.\s]?-[\.\s]?(MeGusta|RZeroX|UTR|SAMPA|EMBER|LION|MZABI)[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.x265-MeGusta', 'Movie.Name.2020.1080p.x265-RZeroX'],
    extract: (match) => ({ 
      p2pInfo: { 
        encoder: match[1] 
      } 
    })
  },
  
  // 特定流媒体平台规则 - 新增
  'specific_streaming_platform': {
    id: 'specific_streaming_platform',
    name: '特定流媒体平台',
    description: '特定地区的流媒体平台来源',
    category: '来源信息',
    pattern: /[\.\s]+(NF[\.\s]?WEB[\.\s]?-?DL[\.\s]?(?:ITA|JPN|FRA|ESP|DEU)|AMZN[\.\s]?WEB[\.\s]?-?DL[\.\s]?(?:ITA|JPN|FRA|ESP|DEU))[\.\s]+/i,
    examples: ['Movie.Name.2020.1080p.NF.WEB-DL.ITA', 'Movie.Name.2020.1080p.AMZN.WEB-DL.JPN'],
    extract: (match) => {
      const platformMatch = match[1].match(/(NF|AMZN)/i);
      const regionMatch = match[1].match(/(ITA|JPN|FRA|ESP|DEU)/i);
      return {
        streamingPlatform: platformMatch ? platformMatch[1] : undefined,
        region: regionMatch ? regionMatch[1] : undefined
      };
    }
  },
  
  // HamiVideo平台规则 - 新增
  'hamivideo_platform': {
    id: 'hamivideo_platform',
    name: 'HamiVideo平台',
    description: '台湾HamiVideo流媒体平台来源',
    category: '来源信息',
    pattern: /[\.\s]+HamiVideo[\.\s]+/i,
    examples: ['Doctor.X.the.Movie.2024.1080p.HamiVideo.WEB-DL.AAC2.0.H.264-DreamHD'],
    extract: (match) => ({ streamingPlatform: 'HamiVideo' })
  },
  
  // Scene官方规范标识规则 - 新增
  'scene_tags': {
    id: 'scene_tags',
    name: 'Scene规范标识',
    description: 'Scene官方规范中的特殊标识',
    category: '发布信息',
    pattern: /[.\s\-_\[\(](PROPER|REPACK|READ[.\s]?NFO|DIRFIX|NFOFIX|RERIP|DUPE|SUBFIX|LIMITED|FESTIVAL|INTERNAL|STV|PPV|COMPLETE|REMASTERED|RESTORED|WS|FS|OAR|RETAIL|DVDR\d?|NTSC|PAL|MULTi|MULTiSUBS|SUBPACK)(?:[.\s\-_\]\)]|$)/i,
    examples: ['Movie.Name.2020.1080p.PROPER', 'Movie.Name.2020.1080p.REPACK'],
    extract: (match) => {
      console.log('match',match)
      const tag = match[1].toUpperCase();
      const sceneInfo: any = {};
      
      if (tag === 'PROPER') sceneInfo.proper = true;
      else if (tag === 'REPACK') sceneInfo.repack = true;
      else if (tag === 'READ.NFO' || tag === 'READNFO') sceneInfo.readNfo = true;
      else if (tag === 'DIRFIX') sceneInfo.dirFix = true;
      else if (tag === 'NFOFIX') sceneInfo.nfoFix = true;
      else if (tag === 'RERIP') sceneInfo.reRip = true;
      else if (tag === 'DUPE') sceneInfo.dupe = true;
      else if (tag === 'SUBFIX') sceneInfo.subFix = true;
      else if (tag === 'LIMITED') sceneInfo.limited = true;
      else if (tag === 'FESTIVAL') sceneInfo.festival = true;
      else if (tag === 'INTERNAL') sceneInfo.internal = true;
      else if (tag === 'STV') sceneInfo.stv = true;
      else if (tag === 'PPV') sceneInfo.ppv = true;
      else if (tag === 'COMPLETE') sceneInfo.complete = true;
      else if (tag === 'REMASTERED') sceneInfo.remastered = true;
      else if (tag === 'RESTORED') sceneInfo.restored = true;
      else if (tag === 'WS') sceneInfo.ws = true;
      else if (tag === 'FS') sceneInfo.fs = true;
      else if (tag === 'OAR') sceneInfo.oar = true;
      else if (tag === 'RETAIL') sceneInfo.retail = true;
      else if (tag.startsWith('DVDR')) sceneInfo.dvdr = tag;
      else if (tag === 'NTSC' || tag === 'PAL') sceneInfo.tvSystem = tag;
      else if (tag === 'MULTI') sceneInfo.multi = true;
      else if (tag === 'MULTISUBS') sceneInfo.multiSubs = true;
      else if (tag === 'SUBPACK') sceneInfo.subPack = true;
      
      return { sceneInfo };
    }
  },
  
  // P2P/Usenet扩展标识规则 - 新增
  'p2p_tags': {
    id: 'p2p_tags',
    name: 'P2P扩展标识',
    description: 'P2P/Usenet发布中的扩展标识',
    category: '发布信息',
    pattern: /[.\s\-_\[\(](HYBRID|UHD[.\s]?REMUX|BD[.\s]?REMUX|REMUX|BD\d+|DoVi[.\s]?BD|DoVi[.\s]?HEVC|HDR10plus[.\s]?Profile[.\s]?[AB]|SDR10|SDR2020)(?:[.\s\-_\]\)]|$)/i,
    examples: ['Movie.Name.2020.2160p.HYBRID', 'Movie.Name.2020.2160p.UHD.REMUX'],
    extract: (match) => {
      const tag = match[1].toUpperCase().replace(/[\.\s]/g, '.');
      const p2pInfo: any = {};
      
      if (tag === 'HYBRID') p2pInfo.hybrid = true;
      else if (tag === 'UHD.REMUX' || tag === 'BD.REMUX') p2pInfo.remux = tag;
      else if (tag.startsWith('BD') && /\d+/.test(tag)) p2pInfo.bdSize = tag;
      else if (tag === 'DOVI.BD' || tag === 'DOVI.HEVC') p2pInfo.doVi = tag;
      else if (tag.includes('HDR10PLUS.PROFILE')) p2pInfo.hdr10PlusProfile = tag;
      else if (tag === 'SDR10' || tag === 'SDR2020') p2pInfo.sdrType = tag;
      
      return { p2pInfo };
    }
  }
};
