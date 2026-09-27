import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './entities/categoria.entity';
@Injectable()
export class CategoriasService {

  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) { }

  async create(createCategoriaDto: CreateCategoriaDto) {
    const categoriaExistente = await this.categoriaRepository.findOneBy({ nombre: createCategoriaDto.nombre });
    if (categoriaExistente) {
      throw new Error(`La categoría con nombre ${createCategoriaDto.nombre} ya existe`);
    }
    const nuevaCategoria = this.categoriaRepository.create(createCategoriaDto);
    return await this.categoriaRepository.save(nuevaCategoria);
  }

  async findAll() {
    return await this.categoriaRepository.find();
  }

  async findOne(id: number) {
    const categoria = await this.categoriaRepository.findOneBy({ id });
    if (!categoria) {
      throw new Error(`La categoría con ID ${id} no existe`);
    }
    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.findOne(id);
    if (updateCategoriaDto.nombre && updateCategoriaDto.nombre !== categoria.nombre) {
      const nombreExistente = await this.categoriaRepository.findOneBy({ nombre: updateCategoriaDto.nombre });
      if (nombreExistente) {
        throw new Error(`La categoría con nombre ${updateCategoriaDto.nombre} ya existe`);
      }
    }
    this.categoriaRepository.merge(categoria, updateCategoriaDto);
    return await this.categoriaRepository.save(categoria);
  }

  async remove(id: number) {
    const categoria = await this.findOne(id);
    return await this.categoriaRepository.remove(categoria);
  }
}

