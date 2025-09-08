import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "影片文件名解析器 - Film Name Decoder | 智能解析电影文件名信息",
  description = "专业的影视文件名智能解析工具，支持电影、电视剧文件名的详细信息识别，包括分辨率、编码格式、音频信息、片源类型等。免费在线使用，支持Scene和P2P发布规范。",
  keywords = "影片文件名解析,电影文件名解析器,视频文件名分析,媒体文件解析,Scene规则,P2P发布,视频编码识别,分辨率检测,音频格式识别",
  image = "/og-image.jpg",
  url = "",
  type = "website"
}) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImageUrl = `${siteUrl}${image}`;

  return (
    <Helmet>
      {/* 基础SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Film Name Decoder" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Film Name Decoder" />
      <meta property="og:locale" content="zh_CN" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* 额外的SEO标签 */}
      <meta name="theme-color" content="#1e293b" />
      <meta name="msapplication-TileColor" content="#1e293b" />
      <link rel="canonical" href={fullUrl} />
      
      {/* 结构化数据 */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Film Name Decoder",
          "alternateName": "影片文件名解析器",
          "description": description,
          "url": fullUrl,
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "CNY"
          },
          "creator": {
            "@type": "Organization",
            "name": "Film Name Decoder"
          },
          "featureList": [
            "智能识别影片标题和年份",
            "解析视频分辨率和编码格式", 
            "识别音频格式和声道布局",
            "检测片源类型和发布组信息",
            "支持Scene和P2P发布规范"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;