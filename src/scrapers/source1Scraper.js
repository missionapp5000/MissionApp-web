const axios = require("axios");
const cheerio = require("cheerio");

exports.fetchMovies = async () => {
  // Example URL for scraping (replace with an actual source)
  const response = await axios.get("https://example.com/movies");
  const $ = cheerio.load(response.data);
  const movies = [];
  $(".movie-item").each((i, el) => {
    movies.push({
      id: $(el).data("id"),
      title: $(el).find(".title").text(),
      poster: $(el).find("img").attr("src"),
    });
  });
  return movies;
};

exports.fetchMovieDetails = async (id) => {
  // Example URL for movie details (replace with an actual source)
  const response = await axios.get(`https://example.com/movie/${id}`);
  const $ = cheerio.load(response.data);
  return {
    title: $(".movie-title").text(),
    videoUrl: $(".video-player").data("src"),
  };
};