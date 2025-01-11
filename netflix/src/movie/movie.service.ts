import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entity/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  getManyMovies() {
    // TODO: 영화 제목 검색 기능 나중에 추가
    return this.movieRepository.find();
  }

  async getMovieById(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
    });

    if (!movie) {
      throw new NotFoundException(`ID ${id} 영화가 없습니다.`); // 에러 메시지와 함께 404 에러 뜸
    }

    return movie;
  }

  async createMovie(createMovieDto: CreateMovieDto) {
    const movie = await this.movieRepository.save(createMovieDto);
    return movie;
  }

  async updateMovie(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
    });

    if (!movie) {
      throw new NotFoundException(`ID ${id} 영화가 없습니다.`);
    }

    await this.movieRepository.update(id, updateMovieDto);

    const newMovie = await this.movieRepository.findOne({
      where: {
        id,
      },
    });

    return newMovie;
  }

  async deleteMovie(id: number) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
    });

    if (!movie) {
      throw new NotFoundException(`ID ${id} 영화가 없습니다.`);
    }

    await this.movieRepository.delete(id);

    return id;
  }
}
