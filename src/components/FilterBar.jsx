const games = ["All", "Pokémon", "Magic", "One Piece", "Yu-Gi-Oh!", "Accesorios"];

export default function FilterBar({
  selectedGame,
  setSelectedGame,
  search,
  setSearch,
}) {
  return (
    <section className="filters">
      <input
        className="search-input"
        type="text"
        placeholder="Buscar carta, producto o expansión..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="filter-group">
        {games.map((game) => (
          <button
            key={game}
            className={selectedGame === game ? "filter active" : "filter"}
            onClick={() => setSelectedGame(game)}
          >
            {game}
          </button>
        ))}
      </div>
    </section>
  );
}