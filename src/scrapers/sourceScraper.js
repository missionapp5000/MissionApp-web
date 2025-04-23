const axios = require("axios");
const cheerio = require("cheerio");

exports.fetchMovies = async () => {
  const response = await axios.get("https://source1.com/movies");
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
  const response = await axios.get(`https://source1.com/movie/${id}`);
  const $ = cheerio.load(response.data);
  return {
    title: $(".movie-title").text(),
    videoUrl: $(".video-player").data("src"),
  };
};