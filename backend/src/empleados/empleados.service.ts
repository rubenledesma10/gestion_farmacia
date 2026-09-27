import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    if ( updateEmpleadoDto.email || updateEmpleadoDto.dni) {
      const duplicado = await this.empleadoRepository.findOne({
        where: [
          { email: updateEmpleadoDto.email },
          { dni: updateEmpleadoDto.dni }
        ]
      });

      if (duplicado && duplicado.id !== id) {
        if (duplicado.email === updateEmpleadoDto.email) {
          throw new Error(`El email ${updateEmpleadoDto.email} ya está en uso por otro empleado`);
        }
        if (duplicado.dni === updateEmpleadoDto.dni) {
          throw new Error(`El DNI ${updateEmpleadoDto.dni} ya está en uso por otro empleado`);
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
