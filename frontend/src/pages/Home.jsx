import React, { useState, useEffect } from 'react';
import { movieService, authService } from '../services';
import HeroSection from '../components/Home/HeroSection';
import FeaturedMoviesSection from '../components/Home/FeaturedMoviesSection';
import PricingSection from '../components/Home/PricingSection';
import FeaturesSection from '../components/Home/FeaturesSection';

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    fetchFeaturedMovies();
  }, []);

  const fetchFeaturedMovies = async () => {
    try {
      const response = await movieService.getAllMovies(); // CHANGED THIS LINE
      setFeaturedMovies(response.movies || []);
    } catch (error) {
      console.error('Failed to fetch featured movies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-4 min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <HeroSection user={user} />
      <FeaturedMoviesSection loading={loading} featuredMovies={featuredMovies} />
      <PricingSection />
      <FeaturesSection />
    </div>
  );
};

export default Home;