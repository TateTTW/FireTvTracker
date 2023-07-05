import {MediaItem} from "./media-item";

export interface MediaItemDetails extends MediaItem {
  Actors: string;
  Awards: string;
  BoxOffice: string;
  DVD: string;
  Director: string;
  Genre: string;
  Metascore: string;
  Plot: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Writer: string;
  imdbRating: string;
  imdbVotes: string;
}
