import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { Director } from './entity/director.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DirectorService {
  constructor(
    @InjectRepository(Director)
    private directorRepository: Repository<Director>,
  ) {}

  create(createDirectorDto: CreateDirectorDto) {
    return this.directorRepository.save(createDirectorDto);
  }

  findAll() {
    return this.directorRepository.find();
  }

  findOne(id: number) {
    const director = this.directorRepository.findOne({
      where: { id },
      relations: ['movies'],
    });

    if (!director) {
      throw new NotFoundException(`ID ${id} 감독이 없습니다.`);
    }

    return director;
  }

  async update(id: number, updateDirectorDto: UpdateDirectorDto) {
    const director = await this.directorRepository.findOne({
      where: { id },
      relations: ['movies'],
    });

    if (!director) {
      throw new NotFoundException(`ID ${id} 감독이 없습니다.`);
    }

    await this.directorRepository.update(id, updateDirectorDto);

    const newDirector = await this.directorRepository.findOne({
      where: { id },
    });

    return newDirector;
  }

  async remove(id: number) {
    const director = await this.directorRepository.findOne({
      where: { id },
    });

    if (!director) {
      throw new NotFoundException(`ID ${id} 감독이 없습니다.`);
    }

    await this.directorRepository.delete(id);

    return id;
  }
}
