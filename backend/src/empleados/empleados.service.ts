import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { Empleado } from './entities/empleado.entity';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

@Injectable()
export class EmpleadosService {

  constructor(
    @InjectRepository(Empleado)
    private empleadoRepository: Repository<Empleado>,
  ) { }

  async create(createEmpleadoDto: CreateEmpleadoDto) {
    const empleado = this.empleadoRepository.create(createEmpleadoDto);
    return this.empleadoRepository.save(empleado);
  }

  async findAll() {
    return await this.empleadoRepository.find();
  }

  async findOne(id: number) {
    const empleado = await this.empleadoRepository.findOne({ where: { id } });
    if (!empleado) {
      throw new Error(`Empleado con ID ${id} no encontrado`);
    }
    return empleado;
  }

  async update(id: number, updateEmpleadoDto: UpdateEmpleadoDto) {
    const empleado = await this.findOne(id);

    const condicionesWhere = [];

    if (updateEmpleadoDto.email) {
      condicionesWhere.push({ email: updateEmpleadoDto.email });
    }
    
    if (updateEmpleadoDto.dni) {
      condicionesWhere.push({ dni: updateEmpleadoDto.dni });
    }

    if (condicionesWhere.length > 0) {
      const duplicado = await this.empleadoRepository.findOne({
        where: condicionesWhere,
      });

      if (duplicado && duplicado.id !== id) {
        if (updateEmpleadoDto.email && duplicado.email === updateEmpleadoDto.email) {
          throw new ConflictException('El email ingresado ya pertenece a otro empleado.');
        }
        if (updateEmpleadoDto.dni && duplicado.dni === updateEmpleadoDto.dni) {
          throw new ConflictException('El DNI ingresado ya pertenece a otro empleado.');
        }
      }
    }

    this.empleadoRepository.merge(empleado, updateEmpleadoDto);
    return await this.empleadoRepository.save(empleado);
  }

  async remove(id: number) {
    const empleado = await this.findOne(id);
    return this.empleadoRepository.remove(empleado);
  }
}
