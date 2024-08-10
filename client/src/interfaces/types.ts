interface Position {
  lat: number;
  lng: number;
}

interface Image {
  _id: string;
  url: string;
  filename: string;
}

interface Review {
  _id: string;
  author: User;
  rating: number;
  body: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Campground {
  _id: string;
  title: string;
  description: string;
  location: string;
  rating: number;
  favorites: number;
  visits: number;
  images: Image[];
  position: Position;
  price: number;
  author: User;
  reviews: Review[];
}

export type { Position, Image, Review, Campground };
