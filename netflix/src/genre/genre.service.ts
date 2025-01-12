import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) {}

  async create(createGenreDto: CreateGenreDto) {
    const genre = await this.genreRepository.save(createGenreDto);
    return genre;
  }

  async findAll() {
    const genres = await this.genreRepository.find();
    return genres;
  }

  async findOne(id: number) {
    const genre = await this.genreRepository.findOne({
      where: { id },
      relations: ['movies'],
    });

    if (!genre) {
      throw new NotFoundException(`id ${id} 장르를 찾을 수 없습니다.`);
    }

    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const genre = await this.genreRepository.findOne({
      where: { id },
    });

    if (!genre) {
      throw new NotFoundException(`id ${id} 장르를 찾을 수 없습니다.`);
    }

    await this.genreRepository.update(id, updateGenreDto);

    const newGenre = await this.genreRepository.findOne({
      where: { id },
    });

    return newGenre;
  }

  async remove(id: number) {
    const genre = await this.genreRepository.findOne({ where: { id } });

    if (!genre) {
      throw new NotFoundException(`id ${id} 장르를 찾을 수 없습니다.`);
    }

    await this.genreRepository.delete(id);

    return id;
  }
}
