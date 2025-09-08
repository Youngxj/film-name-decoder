// 定义解析器类型

// 解析结果类型
export interface ParseResult {
  // 原始文件名
  originalFileName: string;
  // 解析后的各个部分
  parts: {
    // 1. 标题 - 片名
    title?: {
      value: string;
      label: string;
      description: string;
    };
    
    // 2. 年份
    year?: {
      value: string;
      label: string;
      description: string;
    };
    
    // 3. 版本类型
    version?: string;
    
    // 4. 分辨率 - 清晰度
    resolution?: {
      value: string;
      label: string;
      description: string;
    };
    
    // 5. 来源 - 片源渠道
    source?: string;
    
    // 流媒体平台 (来源的子类别)
    streamingPlatform?: string;
    
    // 6. 视频编码
    videoCodec?: string;
    
    // 7. 音频编码 - 音频格式
    audioCodec?: string;
    
    // 8. 声道布局
    audioChannels?: {
      value: string;
      label: string;
      description: string;
    };
    
    // 特定音频编码通道组合
    audioCodecChannels?: {
      value: string;
      label: string;
      description: string;
    };
    
    // 9. HDR信息 - 动态范围
    hdr?: string;
    
    // 10. 帧率/色深 - 高级参数
    frameRate?: string;
    colorDepth?: string;
    
    // 11. 发布组 - 压制/发布组
    releaseGroup?: string;
    
    // 12. 封装格式 - 容器
    fileExtension?: {
      value: string;
      explanation: string;
    };
    
    // 电视剧特有信息
    season?: string;
    episode?: string;
    
    // 其他信息
    language?: string;
    region?: string;
    subtitle?: {
      value: string;
      label: string;
      description: string;
    };
    
    // Scene官方规范字段
    sceneInfo?: {
      proper?: boolean;      // PROPER - 修正版
      repack?: boolean;      // REPACK - 重新打包
      readNfo?: boolean;     // READ.NFO - 请阅读NFO
      dirFix?: boolean;      // DIRFIX - 目录修复
      nfoFix?: boolean;      // NFOFIX - NFO修复
      reRip?: boolean;       // RERIP - 重新压制
      dupe?: boolean;        // DUPE - 重复发布
      subFix?: boolean;      // SUBFIX - 字幕修复
      dubbed?: string;       // DUBBED - 配音版本
      limited?: boolean;     // LIMITED - 限量发行
      festival?: boolean;    // FESTIVAL - 电影节版本
      internal?: boolean;    // INTERNAL - 内部发布
      stv?: boolean;         // STV - 直接发行录像带
      ppv?: boolean;         // PPV - 付费点播
      complete?: boolean;    // COMPLETE - 完整版
      remastered?: boolean;  // REMASTERED - 重制版
      restored?: boolean;    // RESTORED - 修复版
      ws?: boolean;          // WS - 宽屏
      fs?: boolean;          // FS - 全屏
      oar?: boolean;         // OAR - 原始比例
      retail?: boolean;      // RETAIL - 零售版
      dvdr?: string;         // DVDR/DVDR9/DVDR5 - DVD规格
      tvSystem?: string;     // NTSC/PAL - 电视制式
      multi?: boolean;       // MULTi - 多语言
      multiSubs?: boolean;   // MULTiSUBS - 多语言字幕
      subPack?: boolean;     // SUBPACK - 字幕包
    };
    
    // P2P/Usenet扩展字段
    p2pInfo?: {
      hybrid?: boolean;           // HYBRID - 多条片源拼接
      remux?: string;             // UHD.REMUX/BD.REMUX - 无损原盘重封装
      bdSize?: string;            // BD25/BD50/BD66/BD100 - 原盘容量
      doVi?: string;              // DoVi.BD/DoVi.HEVC - 杜比视界层级
      hdr10PlusProfile?: string;  // HDR10plus.Profile.A/B - HDR10+版本
      bitDepth?: string;          // 8bit/10bit/12bit - 位深
      colorSpace?: string;        // BT.709/BT.2020 - 色域
      sdrType?: string;           // SDR10/SDR2020 - 伪HDR标识
      dimensionType?: string;     // 2D/3D/HSBS/HTAB - 立体格式
      screenFormat?: string;      // Open.Matte/IMAX/IMAX.Enhanced - 画幅版本
      hardcodedSub?: string;      // HC/KORSUB/HC.HDRip - 硬字幕版本
      watermark?: string;         // CLEAN/DIRTY - 无水印/有水印
      editVersion?: string;       // FanEdit/EXTENDED.EDITION - 剪辑版本
      audioDescription?: boolean; // AD/AAC-AD - 音频描述
      flacAudio?: string;         // FLAC.2.0/FLAC.5.1 - 无损音轨
      commentary?: boolean;       // Commentary/With.Commentary - 评论轨
      extras?: boolean;           // Extras/Bonus.Disc - 花絮特典
      encoder?: string;           // 压制者署名
      formatCombination?: string; // 复杂格式组合
    };
    
    // 其他标识
    tags?: string[];
  };
  // 匹配到的规则ID列表
  matchedRules: string[];
  // 未能识别的部分
  unrecognized?: string;
  titleMatchedText?: string;
}

// 规则类型
export interface Rule {
  // 规则ID
  id: string;
  // 规则名称
  name: string;
  // 规则描述
  description: string;
  // 规则类别
  category: string;
  // 正则表达式模式
  pattern: RegExp;
  // 示例
  examples: string[];
  // 提取函数，从匹配结果中提取有用信息
  extract: (match: RegExpExecArray) => Partial<ParseResult['parts']>;
}

// 规则集合类型
export interface RuleSet {
  [key: string]: Rule;
}