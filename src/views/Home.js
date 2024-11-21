import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import FormEmpleado from '../components/FormEmpleado';
import TablaEmpleados from '../components/TablaEmpleados';
import EmpleadoService from '../services/EmpleadoService';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Modal, Button } from 'react-bootstrap';
import { FaSun, FaMoon } from 'react-icons/fa';

function Home() {
  // Estado para la lista de empleados
  const [empleados, setEmpleados] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  // Estado para el modal de confirmación de eliminación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  // Carga inicial de empleados
  useEffect(() => {
    EmpleadoService.getEmpleados()
      .then(response => setEmpleados(response.data))
      .catch(error => setMessageAndType('Error al cargar empleados', 'danger'));
  }, []);

  // Función para agregar un nuevo empleado
  const addEmpleado = (nuevoEmpleado) => {
    EmpleadoService.addEmpleado(nuevoEmpleado)
      .then(response => {
        setEmpleados([...empleados, response.data]);
        setShowModal(false);
      })
      .catch(error => setMessageAndType('Error al agregar empleado', 'danger'));
  };

  // Función para actualizar un empleado existente
  const updateEmpleado = (id, empleadoActualizado) => {
    EmpleadoService.updateEmpleado(id, empleadoActualizado)
      .then(response => {
        const updatedEmpleados = empleados.map(empleado =>
          empleado.id === id ? response.data : empleado
        );
        setEmpleados(updatedEmpleados);
        setShowModal(false);
      })
      .catch(error => setMessageAndType('Error al actualizar empleado', 'danger'));
  };

  // Función para eliminar un empleado (confirmación)
  const handleDelete = (id) => {
    setEmployeeToDelete(id); // Guarda el empleado a eliminar
    setShowConfirmModal(true); // Muestra el modal de confirmación
  };

  // Confirmación de la eliminación
  const handleConfirmDelete = () => {
    EmpleadoService.deleteEmpleado(employeeToDelete)
      .then(() => {
        const updatedEmpleados = empleados.filter(empleado => empleado.id !== employeeToDelete);
        setEmpleados(updatedEmpleados);
        setMessageAndType('Empleado eliminado con éxito', 'danger');
        setShowConfirmModal(false); // Cierra el modal después de eliminar
      })
      .catch(error => {
        setMessageAndType('Error al eliminar empleado', 'danger');
        setShowConfirmModal(false); // Cierra el modal si ocurre un error
      });
  };

  // Función para mostrar el mensaje y tipo de alerta
  const setMessageAndType = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Configura un empleado para edición y muestra el modal
  const handleEdit = (empleado) => {
    setEditingEmpleado(empleado);
    setShowModal(true);
  };

  // Muestra el modal para agregar un nuevo empleado
  const handleAdd = () => {
    setEditingEmpleado(null);
    setShowModal(true);
  };

  // Hook para manejar el tema claro/oscuro
  const { isDarkMode, toggleTheme } = useTheme();

  // Cambia las clases del cuerpo del documento según el tema
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  // Renderiza el componente principal
  return (
    <div className="container my-5">
      <div className="row align-items-center mb-4">
        <div className="col-12 col-md-7 text-center text-md-end">
          <h1
            className="h1 mb-3 mb-md-0"
            style={{
              fontWeight: 'bold',
              fontSize: '2rem',
            }}
          >
            Lista de Empleados:
          </h1>
        </div>
        <div className="col-12 col-md-5 d-flex justify-content-center justify-content-md-end gap-2">
          <button className="btn btn-primary" onClick={handleAdd}>
            Agregar Empleado
          </button>
          <button
            className="btn btn-secondary d-flex justify-content-center align-items-center"
            onClick={toggleTheme}
            style={{ width: 'auto', height: 'auto' }}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>

      {/* Tabla para listar empleados */}
      <TablaEmpleados empleados={empleados} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Modal para agregar/editar empleado */}
      <FormEmpleado
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleAddEmpleado={addEmpleado}
        handleUpdateEmpleado={updateEmpleado}
        empleado={editingEmpleado}
        
      />
      

      {/* Alerta para notificaciones */}
      {showAlert && (
        <Alert variant={messageType} onClose={() => setShowAlert(false)} dismissible>
          {message}
        </Alert>
      )}

      {/* Modal de confirmación de eliminación */}
      
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} backdrop="static"
                keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este empleado?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Home;
