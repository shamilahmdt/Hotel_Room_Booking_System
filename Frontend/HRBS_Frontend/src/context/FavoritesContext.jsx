import { createContext, useState, useEffect } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("hrbs_favorites");
    return saved ? JSON.parse(saved) : { hotels: [], rooms: [] };
  });

  useEffect(() => {
    localStorage.setItem("hrbs_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavoriteHotel = (hotelId) => {
    setFavorites((prev) => {
      const isFav = prev.hotels.includes(hotelId);
      const newHotels = isFav
        ? prev.hotels.filter((id) => id !== hotelId)
        : [...prev.hotels, hotelId];
      return { ...prev, hotels: newHotels };
    });
  };

  const toggleFavoriteRoom = (roomId) => {
    setFavorites((prev) => {
      const isFav = prev.rooms.includes(roomId);
      const newRooms = isFav
        ? prev.rooms.filter((id) => id !== roomId)
        : [...prev.rooms, roomId];
      return { ...prev, rooms: newRooms };
    });
  };

  const isHotelFavorite = (hotelId) => favorites.hotels.includes(hotelId);
  const isRoomFavorite = (roomId) => favorites.rooms.includes(roomId);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavoriteHotel,
        toggleFavoriteRoom,
        isHotelFavorite,
        isRoomFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
