export interface IMovieData {
  id: number;
  title: string;
  posterPath: string;
  backdropPath: string;
  overview: string;
  popularity: number;
}

export class Movie implements IMovieData {
  public id: number;
  public title: string;
  public posterPath: string;
  public backdropPath: string;
  public overview: string;
  public popularity: number;

  constructor(data: IMovieData) {
    this.id = data.id;
    this.title = data.title;
    this.posterPath = data.posterPath;
    this.backdropPath = data.backdropPath;
    this.overview = data.overview;
    this.popularity = data.popularity;
  }
}
