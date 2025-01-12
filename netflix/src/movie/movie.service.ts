import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entity/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MovieDetail } from './entity/movie-detail.entity';
import { Director } from '@/director/entity/director.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(MovieDetail)
    private readonly movieDetailRepository: Repository<MovieDetail>,

    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
  ) {}

  async findAll(title?: string) {
    if (!title) {
      return [
        await this.movieRepository.find(),
        await this.movieRepository.count(),
      ];
    }

    return await this.movieRepository.findAndCount({
      where: {
        title: Like(`%${title}%`),
      },
    });
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
      relations: ['detail', 'director'],
    });

    if (!movie) {
      throw new NotFoundException(`ID ${id} 영화가 없습니다.`); // 에러 메시지와 함께 404 에러 뜸
    }

    return movie;
  }

  async create(createMovieDto: CreateMovieDto) {
    const director = await this.directorRepository.findOne({
      where: { id: createMovieDto.directorId },
    });

    if (!director) {
      throw new NotFoundException(
        `ID ${createMovieDto.directorId} 감독이 없습니다.`,
      );
    }

    const movie = await this.movieRepository.save({
      title: createMovieDto.title,
      genre: createMovieDto.genre,
      detail: {
        detail: createMovieDto.detail,
      },
      director,
    });

    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail', 'director'],
    });

    if (!movie) {
      throw new NotFoundException(`ID ${id} 영화가 없습니다.`);
    }

    const { detail, directorId, ...movieRest } = updateMovieDto;

    let newDirector;

    if (directorId) {
      const director = await this.directorRepository.findOne({
        where: { id: directorId },
      });

      if (!director) {
        throw new NotFoundException(`ID ${directorId} 감독이 없습니다.`);
      }
      // await this.movieRepository.update(id, { director });
      newDirector = director;
    }

    const movieUpdateFields = {
      ...movieRest,
      ...(newDirector && { director: newDirector }),
    };

    await this.movieRepository.update(id, movieUpdateFields);

    if (detail) {
      const movieDetail = await this.movieDetailRepository.findOne({
        where: { id: movie.detail.id },
      });

      if (!movieDetail) {
        throw new NotFoundException(
          `ID ${movie.detail.id} 상세 정보가 없습니다.`,
        );
      }

      await this.movieDetailRepository.update(movie.detail.id, {
        detail,
      });

      const newMovie = await this.movieRepository.findOne({
        where: { id },
        relations: ['detail', 'director'],
      });

      return newMovie;
    }
  }

  async remove(id: number) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
      relations: ['detail', 'director'],
    });

    if (!movie) {
      throw new NotFoundException(`ID ${id} 영화가 없습니다.`);
    }

    await this.movieRepository.delete(id);
    await this.movieDetailRepository.delete({ id: movie.detail.id });
    return id;
  }
}
