import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class Movie {
  id: number;
  title: string;
  genre: string;

  @Expose()
  get description() {
    return `id: ${this.id}, title: ${this.title}`;
  }
}
