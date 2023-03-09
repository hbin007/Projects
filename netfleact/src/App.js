import './App.css';
import Banner from './components/Banner';
import Nav from './components/Nav';
import Row from './components/Row'
import requests from './requests';

function App() {
  return (
    <div className="App">
      <Nav />
      {/* Banner 부분 */}
      <Banner />
      <Row title='Netflix Originals' fetchUrl={requests.fetchNetflixOriginals} isLargeRow />
      <Row title='Trending Now' fetchUrl={requests.fetchTrending} />
      <Row title='Top Rated' fetchUrl={requests.fetchTopRated} />
      <Row title='Action Movies' fetchUrl={requests.fetchActionMovies} />


    </div>
  );
}

export default App;
