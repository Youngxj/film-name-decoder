import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Separator } from './separator';

// 扩展的IMDB详细信息接口
interface IMDBDetailedResult {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

interface IMDBModalProps {
  isOpen: boolean;
  onClose: () => void;
  imdbID: string;
  title?: string;
}

const IMDBModal: React.FC<IMDBModalProps> = ({ isOpen, onClose, imdbID, title }) => {
  const [movieData, setMovieData] = useState<IMDBDetailedResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 获取详细的IMDB信息
  const fetchDetailedIMDBInfo = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const API_KEY = import.meta.env.VITE_OMDB_API_KEY || '';
      
      if (!API_KEY) {
        // 如果没有API密钥，使用模拟数据
        const mockData = getMockDetailedData(id);
        setMovieData(mockData);
        return;
      }

      const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovieData(data);
      } else {
        setError(data.Error || '获取详细信息失败');
      }
    } catch (err) {
      console.error('获取IMDB详细信息错误:', err);
      // 出错时使用模拟数据
      const mockData = getMockDetailedData(id);
      setMovieData(mockData);
    } finally {
      setLoading(false);
    }
  };

  // 模拟详细数据
  const getMockDetailedData = (id: string): IMDBDetailedResult => {
    const mockDatabase: Record<string, IMDBDetailedResult> = {
      'tt0133093': {
        imdbID: 'tt0133093',
        Title: 'The Matrix',
        Year: '1999',
        Rated: 'R',
        Released: '31 Mar 1999',
        Runtime: '136 min',
        Genre: 'Action, Sci-Fi',
        Director: 'Lana Wachowski, Lilly Wachowski',
        Writer: 'Lilly Wachowski, Lana Wachowski',
        Actors: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss',
        Plot: '一名计算机程序员被神秘的反叛者莫菲斯带领，发现现实世界实际上是由一个名为"矩阵"的恶意网络程序模拟的。他必须选择是继续生活在虚拟现实中，还是加入反抗军来对抗机器统治者。',
        Language: 'English',
        Country: 'United States, Australia',
        Awards: 'Won 4 Oscars. 42 wins & 51 nominations total',
        Poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
        Ratings: [
          { Source: 'Internet Movie Database', Value: '8.7/10' },
          { Source: 'Rotten Tomatoes', Value: '88%' },
          { Source: 'Metacritic', Value: '73/100' }
        ],
        Metascore: '73',
        imdbRating: '8.7',
        imdbVotes: '1,956,404',
        Type: 'movie',
        DVD: '21 Sep 1999',
        BoxOffice: '$171,479,930',
        Production: 'Warner Bros. Pictures',
        Website: 'N/A',
        Response: 'True'
      },
      'tt1375666': {
        imdbID: 'tt1375666',
        Title: 'Inception',
        Year: '2010',
        Rated: 'PG-13',
        Released: '16 Jul 2010',
        Runtime: '148 min',
        Genre: 'Action, Adventure, Sci-Fi',
        Director: 'Christopher Nolan',
        Writer: 'Christopher Nolan',
        Actors: 'Leonardo DiCaprio, Marion Cotillard, Tom Hardy',
        Plot: '一个熟练的小偷，他是提取秘密的艺术中的绝对最佳，从潜意识的深处，在梦境状态下，当心灵最脆弱的时候。柯布的稀有能力使他成为企业间谍活动这个背叛的新世界中令人垂涎的玩家，但这也使他成为了国际逃犯，并失去了他所爱的一切。',
        Language: 'English, Japanese, French',
        Country: 'United States, United Kingdom',
        Awards: 'Won 4 Oscars. 157 wins & 220 nominations total',
        Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
        Ratings: [
          { Source: 'Internet Movie Database', Value: '8.8/10' },
          { Source: 'Rotten Tomatoes', Value: '87%' },
          { Source: 'Metacritic', Value: '74/100' }
        ],
        Metascore: '74',
        imdbRating: '8.8',
        imdbVotes: '2,389,952',
        Type: 'movie',
        DVD: '07 Dec 2010',
        BoxOffice: '$292,587,330',
        Production: 'Warner Bros. Pictures',
        Website: 'N/A',
        Response: 'True'
      }
    };

    return mockDatabase[id] || {
      imdbID: id,
      Title: title || '未知电影',
      Year: 'N/A',
      Rated: 'N/A',
      Released: 'N/A',
      Runtime: 'N/A',
      Genre: 'N/A',
      Director: 'N/A',
      Writer: 'N/A',
      Actors: 'N/A',
      Plot: '暂无剧情简介',
      Language: 'N/A',
      Country: 'N/A',
      Awards: 'N/A',
      Poster: 'https://via.placeholder.com/300x450.png?text=No+Image',
      Ratings: [],
      Metascore: 'N/A',
      imdbRating: 'N/A',
      imdbVotes: 'N/A',
      Type: 'movie',
      DVD: 'N/A',
      BoxOffice: 'N/A',
      Production: 'N/A',
      Website: 'N/A',
      Response: 'True'
    };
  };

  // 刷新数据
  const handleRefresh = () => {
    if (imdbID) {
      fetchDetailedIMDBInfo(imdbID);
    }
  };

  // 当弹窗打开时获取数据
  useEffect(() => {
    if (isOpen && imdbID) {
      fetchDetailedIMDBInfo(imdbID);
    }
  }, [isOpen, imdbID]);

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 弹窗内容 */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] mx-4 overflow-hidden">
        <Card className="bg-card/95 border-border backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl text-blue-300">
                IMDB 详细信息
              </CardTitle>
              <CardDescription>
                完整的电影/电视剧信息
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="border-blue-800 text-blue-300 hover:bg-blue-900/30"
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                刷新
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="max-h-[calc(90vh-120px)] overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-muted-foreground">正在获取详细信息...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="text-red-500 text-4xl mb-4">⚠️</div>
                  <p className="text-red-400 mb-2">获取信息失败</p>
                  <p className="text-muted-foreground text-sm">{error}</p>
                </div>
              </div>
            )}

            {movieData && !loading && (
              <div className="space-y-6">
                {/* 基本信息和海报 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 海报 */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-0">
                      <img
                        src={movieData.Poster !== 'N/A' ? movieData.Poster : 'https://via.placeholder.com/300x450.png?text=No+Image'}
                        alt={movieData.Title}
                        className="w-full rounded-lg shadow-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450.png?text=No+Image';
                        }}
                      />
                      
                      {/* IMDB链接 */}
                      <div className="mt-4">
                        <a
                          href={`https://www.imdb.com/title/${movieData.imdbID}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors font-medium cursor-pointer"
                        >
                          <span className="font-bold mr-2">在 IMDb 上查看</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* 详细信息 */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* 标题和基本信息 */}
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">{movieData.Title}</h1>
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge variant="outline" className="border-blue-600 text-blue-300">
                          {movieData.Year}
                        </Badge>
                        {movieData.Rated !== 'N/A' && (
                          <Badge variant="outline" className="border-green-600 text-green-300">
                            {movieData.Rated}
                          </Badge>
                        )}
                        {movieData.Runtime !== 'N/A' && (
                          <Badge variant="outline" className="border-purple-600 text-purple-300">
                            {movieData.Runtime}
                          </Badge>
                        )}
                        <Badge variant="outline" className="border-orange-600 text-orange-300">
                          {movieData.Type === 'movie' ? '电影' : '电视剧'}
                        </Badge>
                      </div>
                      
                      {/* 类型标签 */}
                      {movieData.Genre !== 'N/A' && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {movieData.Genre.split(', ').map((genre, index) => (
                            <Badge key={index} className="bg-slate-700 text-slate-200">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 评分信息 */}
                    {movieData.Ratings.length > 0 && (
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-300 mb-3">评分信息</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {movieData.Ratings.map((rating, index) => (
                            <div key={index} className="text-center">
                              <div className="text-2xl font-bold text-foreground">{rating.Value}</div>
                              <div className="text-sm text-muted-foreground">{rating.Source}</div>
                            </div>
                          ))}
                        </div>
                        {movieData.imdbVotes !== 'N/A' && (
                          <div className="text-center mt-2 pt-2 border-t border-border">
                            <div className="text-sm text-muted-foreground">
                              基于 {movieData.imdbVotes} 票
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 剧情简介 */}
                    {movieData.Plot !== 'N/A' && (
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-300 mb-3">剧情简介</h3>
                        <p className="text-foreground leading-relaxed">{movieData.Plot}</p>
                      </div>
                    )}

                    {/* 制作信息 */}
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-300 mb-3">制作信息</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {movieData.Director !== 'N/A' && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">导演</div>
                            <div className="text-foreground">{movieData.Director}</div>
                          </div>
                        )}
                        {movieData.Writer !== 'N/A' && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">编剧</div>
                            <div className="text-foreground">{movieData.Writer}</div>
                          </div>
                        )}
                        {movieData.Actors !== 'N/A' && (
                          <div className="md:col-span-2">
                            <div className="text-sm text-muted-foreground mb-1">主演</div>
                            <div className="text-foreground">{movieData.Actors}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 发行信息 */}
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-300 mb-3">发行信息</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {movieData.Released !== 'N/A' && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">上映日期</div>
                            <div className="text-foreground">{movieData.Released}</div>
                          </div>
                        )}
                        {movieData.Country !== 'N/A' && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">制片国家</div>
                            <div className="text-foreground">{movieData.Country}</div>
                          </div>
                        )}
                        {movieData.Language !== 'N/A' && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">语言</div>
                            <div className="text-foreground">{movieData.Language}</div>
                          </div>
                        )}
                        {movieData.Production !== 'N/A' && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">制片公司</div>
                            <div className="text-foreground">{movieData.Production}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 商业信息 */}
                    {(movieData.BoxOffice !== 'N/A' || movieData.Awards !== 'N/A') && (
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-300 mb-3">商业与奖项</h3>
                        <div className="space-y-3">
                          {movieData.BoxOffice !== 'N/A' && (
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">票房</div>
                              <div className="text-foreground font-medium">{movieData.BoxOffice}</div>
                            </div>
                          )}
                          {movieData.Awards !== 'N/A' && (
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">奖项</div>
                              <div className="text-foreground">{movieData.Awards}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IMDBModal;