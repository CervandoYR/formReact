import React, { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import $ from 'jquery';
import 'datatables.net-bs4';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTheme } from '../context/ThemeContext';

function TablaEmpleados({ empleados, onEdit, onDelete, onAdd }) {
    const { isDarkMode } = useTheme(); 

    useEffect(() => {
        $(document).ready(function() {
            $('#empleadosTable').DataTable();
        });
    }, []);

    const columns = [
        {
            name: 'Nombre',
            selector: row => row.nombre,
            sortable: true,
            center: true,
            style: { textAlign: 'center', verticalAlign: 'middle' },
            headerStyle: { textAlign: 'center' },
        },
        {
            name: 'DNI',  
            selector: row => row.dni,
            sortable: true,
            center: true,
            style: { textAlign: 'center', verticalAlign: 'middle' },
            headerStyle: { textAlign: 'center' },
        },
        {
            name: 'Puesto',
            selector: row => row.puesto,
            sortable: true,
            center: true,
            style: { textAlign: 'center', verticalAlign: 'middle' },
            headerStyle: { textAlign: 'center' },
        },
        {
            name: 'Salario S/.',
            selector: row => row.salario,
            sortable: true,
            center: true,
            style: { textAlign: 'center', verticalAlign: 'middle' },
            headerStyle: { textAlign: 'center' },
        },
        {
            name: 'Teléfono',
            selector: row => row.telefono,
            sortable: true,
            center: true,
            style: { textAlign: 'center', verticalAlign: 'middle' },
            headerStyle: { textAlign: 'center' },
        },
        {
            name: 'Correo',
            selector: row => row.correo,
            sortable: true,
            center: true,
            style: { textAlign: 'center', verticalAlign: 'middle' },
            headerStyle: { textAlign: 'center' },
        },
        
        {
            name: 'Acciones',
            cell: row => (
                <div className="d-flex justify-content-center">
                    <button className="btn btn-warning me-2" onClick={() => onEdit(row)}>
                        <FaEdit />
                    </button>
                    <button className="btn btn-danger" onClick={() => onDelete(row.id)}>
                        <FaTrashAlt />
                    </button>
                </div>
            ),
            center: true,
            style: { textAlign: 'center', verticalAlign: 'middle' },
            headerStyle: { textAlign: 'center' },
        },
    ];

    return (
        <div className="container my-5">
            <div className="table-responsive mx-auto" style={{ maxWidth: '2000px' }}>
                <DataTable
                    id="empleadosTable"
                    columns={columns}
                    data={empleados}
                    pagination
                    keyField="id"
                    striped
                    highlightOnHover
                    responsive
                    theme={isDarkMode ? 'dark' : 'default'}
                />
            </div>
        </div>
    );
}

export default TablaEmpleados;
