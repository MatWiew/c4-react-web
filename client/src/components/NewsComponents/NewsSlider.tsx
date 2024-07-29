import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Article {
  _id: string;
  title: string;
  content: string;
  image_url: string; // Ensure your schema includes this field
}

const NewsSlider: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/articles');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Article[] = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
        setError('Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // Disable default arrows
    adaptiveHeight: true,
    lazyLoad: 'progressive' as const,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Slider {...settings}>
      {articles.length > 0 ? (
        articles.map((article) => (
          <div key={article._id} className="text-center h-[300px]">
            {article.image_url ? (
              <img
                src={article.image_url}
                alt={article.title}
                className="absolute w-[40vw] h-[300px] object-contain z-[1]"
                onError={(e) => {
                  // Handle broken image
                  e.currentTarget.src = 'fallback-image-url'; // Replace with a fallback image URL
                }}
              />
            ) : (
              <div>No image available</div>
            )}
            <h3 className="mt-2 text-lg font-semibold">{article.title}</h3>
            <p className="mt-1 text-sm w-[30vw] mx-auto">{article.content}</p>
          </div>
        ))
      ) : (
        <div>No articles available</div>
      )}
    </Slider>
  );
};

export default NewsSlider;
