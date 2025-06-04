import { useEffect, useState, type ChangeEvent } from "react";

type AddressSuggestion = {
  label: string;
  postcode: string;
  city: string;
  street?: string;
  housenumber?: string;
};

export default function AddressSearchForm() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3 || isSelected) return;

      try {
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
            query
          )}&limit=5`
        );
        const data = await response.json();

        const results = data.features.map((feature: any) => ({
          label: feature.properties.label,
          postcode: feature.properties.postcode,
          city: feature.properties.city,
          street: feature.properties.street,
          housenumber: feature.properties.housenumber,
        }));

        setSuggestions(results);
      } catch (err) {
        console.error("Erreur lors de la récupération des suggestions :", err);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 100);
    return () => clearTimeout(debounce);
  }, [query, isSelected]);

  const handleSelect = (address: AddressSuggestion) => {
    setQuery(address.label);
    setSuggestions([]);
    setIsSelected(true);
  };

  return (
    <div style={{ margin: "2rem auto" }}>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Rechercher une adresse..."
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
            setIsSelected(false);
          }}
          style={{
            width: "95%",
            padding: "12px",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        />

        {suggestions.length > 0 && (
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid #ccc",
              borderTop: "none",
              borderRadius: "0 0 8px 8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              zIndex: 1000,
            }}
          >
            {suggestions.map((sugg, idx) => (
              <li
                key={idx}
                onClick={() => handleSelect(sugg)}
                style={{
                  color: "black",
                  padding: "10px 14px",
                  cursor: "pointer",
                  borderBottom:
                    idx < suggestions.length - 1 ? "1px solid #eee" : "none",
                }}
              >
                {sugg.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
