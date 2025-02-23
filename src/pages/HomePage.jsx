import {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import { PokeContext } from '../context/PokeContext'
import { useNavigate } from 'react-router-dom'
import { Puff } from 'react-loader-spinner'

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

const HomePage = () => {
  // set up the context
  const {setSelectedPokemon} = useContext(PokeContext)
  // set a loading state
  const [loading, setLoading] = useState(true)
  // set state for search
  const [searchTerm, setSearchTerm] = useState('')
  // set state for type
  const [type, setType] = useState('')
  //setup a filtered state
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  // setup pokemon state for returned pokemon
  const [pokedex, setPokedex] = useState([])
  // initialize Navigate
  const navigate = useNavigate()

  // Fetch Pokemon Function
  const fetchPokemon = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=12`)
      const pokemonData = response.data.results
      console.log(pokemonData);
      
      // Get the detailed data by using the pokemon.url
      const detailedPokemonData = await Promise.all(
        pokemonData.map(async (pokemon) => {
          const pokemonResponse = await axios.get(pokemon.url)
          const type = pokemonResponse.data.types.map((typeData) => typeData.type.name)
          const ability = pokemonResponse.data.abilities.map((abilityData) => abilityData.ability.name)
          const id = pokemonResponse.data.id
          return {
            id: id,
            name: pokemon.name,
            imageURL: pokemonResponse.data.sprites.other['official-artwork'].front_default,
            ability: ability,
            types: type,
            height: pokemonResponse.data.height,
            weight: pokemonResponse.data.weight
          }
        })
      )

      // add onSelect to each pokemon
      // onSelect set the context equal to that selected Pokemon
      const pokemons = detailedPokemonData.map((pokemon) => {
        return {
          ...pokemon,
          onSelect: () => setSelectedPokemon(pokemon)
        }
      })
      setLoading(false)
      // take the pokemon from above and add to state variable (pokedex) so I can filter
      setPokedex(pokemons);
      // filtering - initial filter sate with all the pokedex data
      setFilteredPokemon(pokemons)

    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  // Initial Render API Call
  useEffect(() => {
    fetchPokemon()
  }, []) // run once

  // API CALL when search or filter changes
  useEffect(() => {
    const filteredData = pokedex.filter((pokemon) => {
        const nameMatch = pokemon.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
        const typeMatch = !type || pokemon.types.includes(type.toLocaleLowerCase())
        return nameMatch && typeMatch
      })

      setFilteredPokemon(filteredData)
  }, [searchTerm, type])

  return (
    <div id='homepage'>
        <h1>POKEDEX</h1>
      <div className='filter-container'>
        <div className='filter'>
            <div className='search-container'>
                <label htmlFor='search'>Search</label>
                <input
                type='text'
                name='search'
                id='search'
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>
        </div>

        <div className='filter'>
            <div className='type-container'>
                <label htmlFor='type'>Type</label>
                <select
                name='type'
                id='type'
                value={type}
                onChange={(event) => setType(event.target.value)}
                >
                <option value=''>Choose Type...</option>
                <option value='normal'>normal</option>
                <option value='fire'>fire</option>
                <option value='water'>water</option>
                <option value='grass'>grass</option>
                <option value='electric'>electric</option>
                <option value='ice'>ice</option>
                <option value='fighting'>fighting</option>
                <option value='poison'>poison</option>
                <option value='ground'>ground</option>
                <option value='flying'>flying</option>
                <option value='psychic'>psychic</option>
                <option value='bug'>bug</option>
                <option value='rock'>rock</option>
                <option value='ghost'>ghost</option>
                <option value='dragon'>dragon</option>
                <option value='dark'>dark</option>
                <option value='steel'>steel</option>
                <option value='fairy'>fairy</option>
                </select>
            </div>
        </div>
      </div>

      <div className='pokemon-display-grid'>
        {loading ? (
          <Puff color='#00BFFF' height={100} width={100}/>
        ) : pokedex.length === 0 ? (<p>No Pokemon Found</p>) : (
            filteredPokemon.map((item, index) => (
            <div
              key={index}
              className='pokemon-card'
              style={{backgroundColor: typeColors[item.types[0].toLocaleLowerCase()]}}
              onClick={() => {
                item.onSelect()
                navigate('/pokemon/')
              }}
            >
                <img src={item.imageURL} alt={item.name}/>
                <div className='card-details'>
                    <p className='poke-id'>{item.id}</p>
                    <p>{item.name}</p>
                    <p>{item.types.join(", ")}</p>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  )
}

export default HomePage