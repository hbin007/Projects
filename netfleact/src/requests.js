const API_KEY = '05fd93d479e2957992e63239fd142a82';

const baseUrl = 'https://api.themoviedb.org/3';

const requests = {
    fetchTrending: `${baseUrl}/trending/all/week?api_key=${API_KEY}&language=ko`,
    fetchNetflixOriginals: `${baseUrl}/discover/tv?api_key=${API_KEY}&with_networks=213`,
    fetchTopRated: `${baseUrl}/movie/top_rated?api_key=${API_KEY}&language=ko`,
    fetchActionMovies: `${baseUrl}/discover/movie?api_key=${API_KEY}&with_genres=28`,
    fetchComedyMovies: `${baseUrl}/discover/movie?api_key=${API_KEY}&with_genres=35`,
    fetchHorrorMovies: `${baseUrl}/discover/movie?api_key=${API_KEY}&with_genres=27`,
    fetchRomanceMovies: `${baseUrl}/discover/movie?api_key=${API_KEY}&with_genres=10749`,
    fetchDocumentaries: `${baseUrl}/discover/movie?api_key=${API_KEY}&with_genres=99`,
}

export default requests;