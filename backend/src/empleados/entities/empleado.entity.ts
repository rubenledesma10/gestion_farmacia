import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('empleados')
export class Empleado {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'varchar', length: 100 })
    apellido: string;

    @Column({ type: 'varchar', length: 20, unique: true })
    dni: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    telefono?: string;

    @Column({ type: 'varchar', length: 50 })
    cargo: string;

    @Column({ type: 'date' })
    fechaIngreso: Date;
}

//nombre, apellido, dni, email, telefono, cargo, fecha de ingreso
