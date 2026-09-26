import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Medicamento } from '../../medicamentos/entities/medicamento.entity';

@Entity('categorias')
export class Categoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @OneToMany(() => Medicamento, (medicamento) => medicamento.categoria)
    medicamentos: Medicamento[];

}
