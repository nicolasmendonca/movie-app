import React from "react";
import axios from "axios";
import { MoviesRepository } from "./src/frameworks";
import { MoviesPage } from "./src/pages/MoviesPage";
import { MoviesPageInteractor } from "./src/useCases";
import { TmdbService } from "./src/services";

export default function App() {
  return (
    <MoviesRepository.Provider
      value={new MoviesPageInteractor(new TmdbService(axios))}
    >
      <MoviesPage />
    </MoviesRepository.Provider>
  );
}
