import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "d4a10570";

export default function App() {

  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId(selectedId => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  useEffect(function () {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`);

        if (!res.ok) throw new Error("Something went wrong wih fetching movies");

        const data = await res.json();

        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    fetchMovies();

  }, [query]);

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
          {error && <ErrorMsg message={error} />}
        </Box>

        <Box>
          {
            selectedId ? <MovieDetails selectedId={selectedId} onCloseMovie={handleCloseMovie} /> :
              <>
                <WatchedSummary watched={watched} />
                <WatchedMoviesList watched={watched} />
              </>
          }
        </Box>
      </Main>
    </>
  );
}


function Navbar({ children }) {

  return (<>
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  </>
  )
}

function Search({ query, setQuery }) {

  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </>
  )
}

function Logo() {

  return (
    <>
      <div className="logo">
        <span>🍿</span>
        <h1>usePopcorn</h1>
      </div>
    </>
  )
}

function NumResults({ movies }) {

  return (
    <>
      <p className="num-results">
        Found <strong>{movies?.length}</strong> results
      </p>
    </>
  )
}


function Main({ children }) {

  return (
    <>
      <main className="main">
        {children}
      </main>
    </>
  )
}


function Box({ children }) {

  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div className="box">
        <Button isOpen={isOpen} setIsOpen={setIsOpen} />
        {isOpen && children}
      </div>
    </>
  )
}

function Button({ isOpen, setIsOpen }) {

  return (
    <>
      <button className="btn-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "–" : "+"}
      </button>
    </>
  )
}

function MovieList({ movies, onSelectMovie }) {

  return (
    <>
      <ul className="list list-movies">
        {movies?.map((movie) => (
          <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
        ))}
      </ul>
    </>
  )
}

function Movie({ movie, onSelectMovie }) {

  return (
    <>
      <li onClick={() => onSelectMovie(movie.imdbID)}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓️</span>
            <span>{movie.Year}</span>
          </p>
        </div>
      </li>
    </>
  )
}

function WatchedSummary({ watched }) {

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <>
      <div className="summary">
        <h2>Movies you watched</h2>
        <div>
          <p>
            <span>#️⃣</span>
            <span>{watched.length} movies</span>
          </p>
          <p>
            <span>⭐️</span>
            <span>{avgImdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{avgUserRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{avgRuntime} min</span>
          </p>
        </div>
      </div>
    </>
  )
}

function WatchedMoviesList({ watched }) {

  return (
    <>
      <ul className="list">
        {watched.map((movie) => (
          <WatchedMovie movie={movie} />
        ))}
      </ul>
    </>
  )
}

function WatchedMovie({ movie }) {

  return (
    <>

      <li key={movie.imdbID}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{movie.runtime} min</span>
          </p>
        </div>
      </li></>
  )
}

function Loader() {

  return (
    <>
      <div className="loader">
        <span>Loading...</span>
      </div>
    </>
  )
}

function ErrorMsg({ message }) {

  return (
    <>
      <p className="error"><span>⛔</span> {message}</p>
    </>
  )
}

function MovieDetails({ selectedId, onCloseMovie }) {

  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


  const { Title: title, Year: year, Poster: poster, Runtime: runtime, imdbRating, Plot: plot,
    Released: released, Actors: actors, Director: director, Genre: genre } = movie;

  useEffect(function () {
    async function getMovieDetails() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      }finally {
        setIsLoading(false);
      }
    }

    getMovieDetails();

  }, [selectedId]);

  return <>
    <div className="details">
      {isLoading && <Loader />}
      {!isLoading && !error && <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>&larr;</button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>{released} &bull; {runtime}</p>
              <p>{genre}</p>
              <p><span>⭐</span>{imdbRating} IMDb rating</p>
            </div>
          </header>

          <section>
            <div className="rating">
              <StarRating maxRating={10} size={24} />
            </div>
            <p><em>{plot}</em></p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>}
         
        {error && <ErrorMsg message={error} />}
      
    </div>
  </>
}

