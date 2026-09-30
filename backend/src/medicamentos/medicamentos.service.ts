import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';
import { Medicamento } from './entities/medicamento.entity';

@Injectable()
export class MedicamentosService {
  constructor(
    @InjectRepository(Medicamento)
    private medicamentoRepository: Repository<Medicamento>,
  ) {}

  //crear
  async create(createMedicamentoDto: CreateMedicamentoDto) {
    //para relacionarlo typeorm entiende que si le pasamos un objeto con el id de la cetegoria, debe vincularlos
    const nuevoMedicamento = this.medicamentoRepository.create({ ...createMedicamentoDto,
       categoria: { id: createMedicamentoDto.categoriaId } }); //armamos la relacion de categoria con el id que llega ne ldto
       return await this.medicamentoRepository.save(nuevoMedicamento);
  }


  //traer todos
  async findAll() {
    return await this.medicamentoRepository.find({ relations: { categoria: true } }); //traemos la categoria relacionada
  }


  //traer uno
  async findOne(id: number) {
    const medicamento = await this.medicamentoRepository.findOne({
      where: { id },
      relations: { categoria: true }, //traemos la categoria relacionada
    });
    if (!medicamento) {
      throw new NotFoundException(`Medicamento con id ${id} no encontrado`);
    }
    return medicamento;
  }


  //actualizar
  async update(id: number, updateMedicamentoDto: UpdateMedicamentoDto) {
    const medicamento = await this.findOne(id);
    
    this.medicamentoRepository.merge(medicamento, updateMedicamentoDto); //este metodo esta diseñado para fusionar propiedades, pero ignora cualq intento de sobreescribir el id generado en la bd
    return await this.medicamentoRepository.save(medicamento);
  }


  //eliminar
  async remove(id: number) {
    const medicamento = await this.findOne(id);
    return await this.medicamentoRepository.remove(medicamento);
  }
}
