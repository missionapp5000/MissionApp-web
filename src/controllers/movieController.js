const scrapers = require("../scrapers");

exports.getMovies = async (req, res) => {
  const source = req.query.source;
  if (!source) return res.render("homepage", { sources: scrapers.sources });

  const movies = await scrapers[source].fetchMovies();
  res.render("homepage", { movies, sources: scrapers.sources });
};

exports.getMovieDetails = async (req, res) => {
  const { source, id } = req.params;
  const movie = await scrapers[source].fetchMovieDetails(id);
  res.render("moviepage", { movie });
};