import {useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { PokeContext } from '../context/PokeContext'

const typeColors = {
    normal: '#B8B08D',
    fire: '#EACFB7',
    water: '#A0C1D1',
    grass: '#9EBF8F',
    electric: '#F2E77A',
    ice: '#A1D2D0',
    fighting: '#B63D3A',
    poison: '#B06DAB',
    ground: '#D6C689',
    flying: '#B69FEC',
    psychic: '#E2868B',
    bug: '#A7BD5B',
    rock: '#BDAF6E',
    ghost: '#8D7B9C',
    dragon: '#8574F8',
    dark: '#8D7B6F',
    steel: '#B9B9CC',
    fairy: '#E3AFC3',
};

const SinglePokemon = () => {
    // bring in selected pokemon
    const {selectedPokemon} = useContext(PokeContext)
    //initialize useNavigate
    const navigate = useNavigate()
    return (
        <>
            <div className='single-card-content' style={{backgroundColor: typeColors[selectedPokemon.types[0].toLocaleLowerCase()]}}>
                
                <button id='backBtn' onClick={() => navigate(-1)}>Go Back</button>
                <h2>{selectedPokemon.name}</h2>
                <img src={selectedPokemon.imageURL} alt={selectedPokemon.name + " image"}/>
                <div className="card-content-info">
                    <p>{selectedPokemon.id}</p>
                    <p>Type: {selectedPokemon.types.join(", ")}</p>
                    <p>Abilities: {selectedPokemon.ability.join(", ")}</p>
                    <p>Height: {selectedPokemon.height}</p>
                    <p>Weight: {selectedPokemon.weight}</p>
                </div>
            </div>
        </>
    )
}

export default SinglePokemon
