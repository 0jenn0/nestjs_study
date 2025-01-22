import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entity/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, QueryRunner, Repository } from 'typeorm';
import { MovieDetail } from './entity/movie-detail.entity';
import { Director } from '@/director/entity/director.entity';
import { Genre } from '@/genre/entities/genre.entity';
import { GetMovieDto } from './dto/get-movie.dto';
import { CommonService } from '@/common/common.service';

@Injectable()
// export class MovieService extends CommonService { // 이렇게 하면 상속받아서도 가능
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(MovieDetail)
    private readonly movieDetailRepository: Repository<MovieDetail>,

    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,

    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,

    private readonly dataSource: DataSource,

    private readonly commonService: CommonService,
  ) {}

  async findAll(dto: GetMovieDto) {
    const { title } = dto;

    const qb = this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.director', 'director')
      .leftJoinAndSelect('movie.genres', 'genres');

    if (title) {
      qb.where('movie.title LIKE :title', { title: `%${title}%` });
    }

    // this.commonService.applyPagePaginationParamsToQb(qb, dto);
    const { nextCursor } =
      await this.commonService.applyCursorPaginationParamsToQb(qb, dto);

    const [data, count] = await qb.getManyAndCount();

    return { data, count, nextCursor };
    //   if (!title) {
    //     return [
    //       await this.movieRepository.find({
    //         relations: ['director'],
    //       }),
    //       await this.movieRepository.count(),
    //     ];
    //   }
    //   return await this.movieRepository.findAndCount({
    //     where: {
    //       title: Like(`%${title}%`),
    //     },
    //     relations: ['director'],
    //   });
    // }
  }

  async findOne(id: number) {
    const movie = await this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.detail', 'detail')
      .leftJoinAndSelect('movie.director', 'director')
      .leftJoinAndSelect('movie.genres', 'genres')
      .where('movie.id = :id', { id })
      .getOne();

    if (!movie) {
      throw new NotFoundException(`ID ${id} 영화가 없습니다.`);
    }
    return movie;
    // const movie = await this.movieRepository.findOne({
    //   where: {
    //     id,
    //   },
    //   relations: ['detail', 'director', 'genres'],
    // });

    // if (!movie) {
    //   throw new NotFoundException(`ID ${id} 영화가 없습니다.`); // 에러 메시지와 함께 404 에러 뜸
    // }

    // return movie;
  }

  async create(createMovieDto: CreateMovieDto, qr: QueryRunner) {
    const director = await qr.manager.findOne(Director, {
      where: { id: createMovieDto.directorId },
    });

    if (!director) {
      throw new NotFoundException(
        `ID ${createMovieDto.directorId} 감독이 없습니다.`,
      );
    }

    const genres = await qr.manager.find(Genre, {
      where: { id: In(createMovieDto.genreIds) },
    });

    if (genres.length !== createMovieDto.genreIds.length) {
      throw new NotFoundException(
        `존재하지 않는 장르가 있습니다. 존재하는 장르 ids = ${genres
          .map(genre => genre.id)
          .join(', ')}`,
      );
    }

    const movieDetail = await qr.manager
      .createQueryBuilder()
      .insert()
      .into(MovieDetail)
      .values({
        detail: createMovieDto.detail,
      })
      .execute();

    const movieDetailId = movieDetail.identifiers[0].id;

    const movie = await qr.manager
      .createQueryBuilder()
      .insert()
      .into(Movie)
      .values({
        title: createMovieDto.title,
        detail: {
          id: movieDetailId,
        },
        director,
      })
      .execute();

    const movieId = movie.identifiers[0].id;

    await qr.manager
      .createQueryBuilder()
      .relation(Movie, 'genres')
      .of(movieId)
      .add(genres.map(genre => genre.id));

    return await qr.manager.findOne(Movie, {
      where: { id: movieId },
      relations: ['detail', 'director', 'genres'],
    });
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const movie = await qr.manager.findOne(Movie, {
        where: { id },
        relations: ['detail', 'director', 'genres'],
      });

      if (!movie) {
        throw new NotFoundException(`ID ${id} 영화가 없습니다.`);
      }

      const { detail, directorId, genreIds, ...movieRest } = updateMovieDto;

      let newDirector;

      if (directorId) {
        const director = await qr.manager.findOne(Director, {
          where: { id: directorId },
        });

        if (!director) {
          throw new NotFoundException(`ID ${directorId} 감독이 없습니다.`);
        }
        // await this.movieRepository.update(id, { director });
        newDirector = director;
      }

      let newGenres;

      if (genreIds) {
        const genres = await qr.manager.find(Genre, {
          where: { id: In(genreIds) },
        });

        if (genres.length !== updateMovieDto.genreIds.length) {
          throw new NotFoundException(
            `존재하지 않는 장르가 있습니다. 존재하는 장르 ids = ${genres
              .map(genre => genre.id)
              .join(', ')}`,
          );
        }
        newGenres = genres;
      }

      const movieUpdateFields = {
        ...movieRest,
        ...(newDirector && { director: newDirector }),
      };

      await qr.manager
        .createQueryBuilder()
        .update(Movie)
        .set(movieUpdateFields)
        .where('id = :id', { id })
        .execute();

      // await this.movieRepository.update(id, movieUpdateFields);

      if (newGenres) {
        const movieToUpdate = await qr.manager.findOne(Movie, {
          where: { id },
          relations: ['genres'],
        });
        movieToUpdate.genres = newGenres;
        await qr.manager.save(movieToUpdate);
      }

      if (detail) {
        await qr.manager
          .createQueryBuilder()
          .update(MovieDetail)
          .set({ detail })
          .where('id = :id', { id: movie.detail.id })
          .execute();
      }

      if (newGenres) {
        await qr.manager
          .createQueryBuilder()
          .relation(Movie, 'genres')
          .of(id)
          .addAndRemove(
            newGenres.map(genre => genre.id),
            movie.genres.map(genre => genre.id),
          );
      }

      // if (detail) {
      //   const movieDetail = await this.movieDetailRepository.findOne({
      //     where: { id: movie.detail.id },
      //   });

      //   if (!movieDetail) {
      //     throw new NotFoundException(
      //       `ID ${movie.detail.id} 상세 정보가 없습니다.`,
      //     );
      //   }

      //   await this.movieDetailRepository.update(movie.detail.id, {
      //     detail,
      //   });

      //   const newMovie = await this.movieRepository.findOne({
      //     where: { id },
      //     relations: ['detail', 'director'],
      //   });

      //   newMovie.genres = newGenres;

      //   await this.movieRepository.save(newMovie);
      // }

      await qr.commitTransaction();

      return await qr.manager.findOne(Movie, {
        where: { id },
        relations: ['detail', 'director', 'genres'],
      });
    } catch (error) {
      await qr.rollbackTransaction();
      throw error;
    } finally {
      await qr.release();
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

    this.movieRepository
      .createQueryBuilder()
      .delete()
      .from(Movie)
      .where('id = :id', { id })
      .execute();
    // await this.movieRepository.delete(id);
    await this.movieDetailRepository.delete({ id: movie.detail.id });
    return id;
  }
}
