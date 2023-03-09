import React, { useEffect, useState } from 'react'
import './Row.css'

const baseUrl = 'https://image.tmdb.org/t/p/original/'

const Row = props => {
    const [movies, setMovies] = useState([]);
    console.log(movies);
    // API call
    useEffect(() => {
        fetch(props.fetchUrl)
            .then(response => response.json())
            .then(data => {
                const movies = data.results;
                // console.log(movies);

                setMovies(movies);
            });
    }, []);

    return (
        <div className='row'>
            <h2>{props.title}</h2>

            <div className={`row__posters`}>
                {movies.map(movie =>
                    <img
                        key={movie.id}
                        className={`row__poster ${props.isLargeRow && 'row__posterLarge'}`}
                        src={`${baseUrl}${props.isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                        alt={movie.name} />
                )}
            </div>
        </div>
    )
}

export default Row