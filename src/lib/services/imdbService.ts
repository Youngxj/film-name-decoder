import { useState, useEffect } from 'react';

// IMDB API 接口
interface IMDBSearchResult {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

// 使用 OMDB API 进行搜索
// 注意：在实际应用中，你需要申请一个 OMDB API 密钥
// 这里使用了一个示例密钥，实际使用时应替换为你自己的密钥
const API_KEY = import.meta.env.VITE_OMDB_API_KEY || '';

/**
 * 根据电影标题和年份搜索 IMDB 信息
 * @param title 电影标题
 * @param year 电影年份（可选）
 * @returns 搜索结果和加载状态
 */
export const useIMDBSearch = (title?: string, year?: string) => {
  const [result, setResult] = useState<IMDBSearchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 如果没有标题，则不执行搜索
    if (!title) {
      setResult(null);
      setLoading(false);
      setError(null);
      return;
    }

    const searchIMDB = async () => {
      setLoading(true);
      setError(null);

      try {
        if(!API_KEY) {
          throw new Error('OMDB API 密钥未设置');
        }
        // 构建搜索 URL
        let url = `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`;
        
        // 如果有年份，添加到搜索参数中
        if (year) {
          url += `&y=${year}`;
        }

        // 发送请求
        const response = await fetch(url);
        const data = await response.json();

        // 检查是否找到结果
        if (data.Response === 'True') {
          setResult({
            imdbID: data.imdbID,
            Title: data.Title,
            Year: data.Year,
            Poster: data.Poster,
            Type: data.Type
          });
        } else {
          setResult(null);
          setError(data.Error || '未找到匹配的电影');
        }
      } catch (err) {
        setResult(null);
        setError('搜索过程中发生错误');
        console.error('IMDB 搜索错误:', err);
      } finally {
        setLoading(false);
      }
    };

    // 执行搜索
    searchIMDB();
  }, [title, year]);

  return { result, loading, error };
};

/**
 * 获取 IMDB 电影页面链接
 * @param imdbID IMDB ID
 * @returns IMDB 页面 URL
 */
export const getIMDBLink = (imdbID: string): string => {
  return `https://www.imdb.com/title/${imdbID}/`;
};

// 模拟 IMDB 搜索结果（用于开发和测试）
export const mockIMDBSearch = (title: string, year?: string): Promise<IMDBSearchResult | null> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      // 一些预定义的电影
      const movies: Record<string, IMDBSearchResult> = {
        'The Matrix': {
          imdbID: 'tt0133093',
          Title: 'The Matrix',
          Year: '1999',
          Poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
          Type: 'movie'
        },
        'Inception': {
          imdbID: 'tt1375666',
          Title: 'Inception',
          Year: '2010',
          Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
          Type: 'movie'
        },
        'Breaking Bad': {
          imdbID: 'tt0903747',
          Title: 'Breaking Bad',
          Year: '2008–2013',
          Poster: 'https://m.media-amazon.com/images/M/MV5BNDkyZThhNmMtZDBjYS00NDBmLTlkMjgtNDM5OGMyNjBkMGZhXkEyXkFqcGdeQXVyMTMzNDExODE5._V1_SX300.jpg',
          Type: 'series'
        },
        'Game of Thrones': {
          imdbID: 'tt0944947',
          Title: 'Game of Thrones',
          Year: '2011–2019',
          Poster: 'https://m.media-amazon.com/images/M/MV5BN2IzYzBiOTQtNGZmMi00NDI5LTgxMzMtN2EzZjA1NjhlOGMxXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
          Type: 'series'
        },
        'Avengers Endgame': {
          imdbID: 'tt4154796',
          Title: 'Avengers: Endgame',
          Year: '2019',
          Poster: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg',
          Type: 'movie'
        },
        'Final Destination Bloodlines': {
          imdbID: 'tt15374942',
          Title: 'Final Destination: Bloodlines',
          Year: '2025',
          Poster: 'https://via.placeholder.com/300x450.png?text=Final+Destination+Bloodlines',
          Type: 'movie'
        }
      };

      // 尝试匹配电影
      let result: IMDBSearchResult | null = null;
      
      // 简单的模糊匹配
      for (const key in movies) {
        if (title.toLowerCase().includes(key.toLowerCase())) {
          result = movies[key];
          
          // 如果提供了年份，检查年份是否匹配
          if (year && !result.Year.includes(year)) {
            continue;
          }
          
          break;
        }
      }

      resolve(result);
    }, 800); // 模拟 800ms 延迟
  });
};

// 导出默认对象
export default {
  useIMDBSearch,
  getIMDBLink,
  mockIMDBSearch
};