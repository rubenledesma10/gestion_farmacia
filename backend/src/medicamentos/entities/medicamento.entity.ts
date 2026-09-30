import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity('medicamentos')
export class Medicamento {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio: number;

    @Column({ type: 'int', default: 0 })
    stock: number;

    @ManyToOne(() => Categoria, (categoria) => categoria.medicamentos)
    @JoinColumn({ name: 'categoria_id' }) // Especifica el nombre de la columna en la BD
    categoria: Categoria;

}