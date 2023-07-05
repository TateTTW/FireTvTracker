import {MediaItem} from "./media-item";

export interface MediaResponse {
  Search: MediaItem[];
  totalResults: string;
  Response: string;
}
