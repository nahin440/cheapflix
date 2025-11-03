import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService, authService } from '../services';
import MovieCard from '../components/MovieCard';

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
      const response = await movieService.getRecentMovies();
      setFeaturedMovies(response.movies || []);
    } catch (error) {
      console.error('Failed to fetch featured movies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-blue-600/10"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Welcome to <span className="text-red-600">CheapFlix</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Stream thousands of movies and TV shows in stunning HD quality. 
            No ads, no commitments, just premium entertainment at an unbeatable price.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!user ? (
              <>
                <Link 
                  to="/register" 
                  className="bg-red-600 hover:bg-red-700 transform hover:scale-105 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg"
                >
                  Start Free Trial
                </Link>
                <Link 
                  to="/movies" 
                  className="border-2 border-gray-600 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
                >
                  Browse Movies
                </Link>
              </>
            ) : (
              <Link 
                to="/movies" 
                className="bg-red-600 hover:bg-red-700 transform hover:scale-105 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg"
              >
                Continue Watching
              </Link>
            )}
          </div>
          
          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">5000+</div>
              <div className="text-gray-400 text-sm">Movies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">HD</div>
              <div className="text-gray-400 text-sm">Quality</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">24/7</div>
              <div className="text-gray-400 text-sm">Streaming</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">3</div>
              <div className="text-gray-400 text-sm">Plans</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Movies Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Featured Movies</h2>
              <p className="text-gray-400">Recently added to our collection</p>
            </div>
            <Link 
              to="/movies" 
              className="text-red-500 hover:text-red-400 font-semibold transition-colors"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="bg-gray-800 rounded-lg animate-pulse">
                  <div className="w-full h-48 bg-gray-700 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {featuredMovies.slice(0, 5).map(movie => (
                <MovieCard key={movie.movie_id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-gray-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the plan that works for you. All plans include access to our entire library.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Level 1 */}
            <div className="bg-gray-800 rounded-xl p-8 text-center border-2 border-gray-700 hover:border-red-500 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-4">Level 1</h3>
              <div className="text-4xl font-bold text-white mb-6">£4.99<span className="text-gray-400 text-lg">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="text-gray-300 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  1 Device
                </li>
                <li className="text-gray-300 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  HD Streaming
                </li>
                <li className="text-gray-300 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  No Downloads
                </li>
              </ul>
              <Link 
                to="/subscription" 
                className="bg-gray-700 hover:bg-gray-600 text-white w-full py-3 rounded-lg font-semibold transition-colors block"
              >
                Get Started
              </Link>
            </div>

            {/* Level 2 - Featured */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-8 text-center transform scale-105 relative shadow-2xl">
              <div className="absolute top-0 right-0 bg-yellow-500 text-gray-900 px-4 py-1 text-sm font-bold rounded-bl-xl rounded-tr-xl">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Level 2</h3>
              <div className="text-4xl font-bold text-white mb-6">£7.99<span className="text-red-200 text-lg">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="text-white flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  1 Device
                </li>
                <li className="text-white flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  HD Streaming
                </li>
                <li className="text-white flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Download Movies
                </li>
              </ul>
              <Link 
                to="/subscription" 
                className="bg-white hover:bg-gray-100 text-red-600 w-full py-3 rounded-lg font-semibold transition-colors block"
              >
                Get Started
              </Link>
            </div>

            {/* Level 3 */}
            <div className="bg-gray-800 rounded-xl p-8 text-center border-2 border-gray-700 hover:border-purple-500 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-4">Level 3</h3>
              <div className="text-4xl font-bold text-white mb-6">£9.99<span className="text-gray-400 text-lg">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="text-gray-300 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  3 Devices
                </li>
                <li className="text-gray-300 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  HD Streaming
                </li>
                <li className="text-gray-300 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Download Movies
                </li>
              </ul>
              <Link 
                to="/subscription" 
                className="bg-gray-700 hover:bg-gray-600 text-white w-full py-3 rounded-lg font-semibold transition-colors block"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Why Choose CheapFlix?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Massive Library</h3>
              <p className="text-gray-400">Thousands of movies and TV shows, with new content added weekly</p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💸</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Budget Friendly</h3>
              <p className="text-gray-400">Premium streaming experience at a fraction of the cost</p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Watch Anywhere</h3>
              <p className="text-gray-400">Stream on your phone, tablet, laptop, or TV</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;