import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup, Alert, Container, Row, Col } from 'react-bootstrap';
import './FormEmpleado.css';
import EmpleadoService from '../services/EmpleadoService';

function FormEmpleado({
    show,
    handleClose,
    handleAddEmpleado,
    handleUpdateEmpleado,
    empleado
}) {
    // Estados para manejar los valores de los campos del formulario 
    const [nombre, setNombre] = useState('');
    const [puesto, setPuesto] = useState('');
    const [salario, setSalario] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [dni, setDni] = useState('');
     // Estados para las validaciones y mensajes
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('success');
    const [nombreError, setNombreError] = useState('');
    const [telefonoError, setTelefonoError] = useState('');
    const [correoError, setCorreoError] = useState('');
    const [salarioError, setSalarioError] = useState('');
    const [dniError, setDniError] = useState('');

    const puestos = ['Administrador', 'Desarrollador', 'Diseñador', 'Soporte Técnico', 'Marketing'];
    // Effect para cargar los datos de un empleado al actualizar
    useEffect(() => {
        if (empleado) {
            setNombre(empleado.nombre);
            setPuesto(empleado.puesto);
            setSalario(empleado.salario);
            setTelefono(empleado.telefono);
            setCorreo(empleado.correo);
            setDni(empleado.dni);
            setNombreError('');
            setTelefonoError('');
            setCorreoError('');
            setSalarioError('');
            setDniError('');
        } else if (show) {
            resetFields();
        }
    }, [empleado, show]);

    // Validación del DNI 
    const validateDni = async (value) => {
        if (!value) return 'El DNI es obligatorio.';
        if (!/^\d{8}$/.test(value)) {
            if (!/^\d+$/.test(value)) {
                return 'El DNI debe contener solo números.';
            }
            return 'El DNI debe tener exactamente 8 dígitos.';
        }

        // Verifica si el DNI ya está registrado en la base de datos
        const isUnique = await checkDniExistente(value);
        if (!isUnique) {
            return 'Este DNI ya está registrado.';
        }

        return '';
    };

    // Validación del nombre
    const validateNombre = (value) => {
        if (!value) return 'El nombre es obligatorio.';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'El nombre solo debe contener letras y espacios.';
        if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
        return '';
    };

    // Validación del teléfono
    const validateTelefono = async (value) => {
        if (!value) return 'El teléfono es obligatorio.';
        if (!/^[0-9]+$/.test(value)) return 'El teléfono solo debe contener números.';
        if (value.length !== 9) return 'El teléfono debe tener exactamente 9 dígitos.';
        const isUnique = await checkTelefonoExistente(value);
        if (!isUnique) return 'Este teléfono ya está registrado.';
        return '';
    };

    // Validación del correo
    const validateCorreo = async (value) => {
        if (!value) return 'El correo es obligatorio.';
        if (!/^[a-zA-Z0-9._-]+@/.test(value)) {
            return 'El correo debe tener un formato válido.';
        }
        if (!/@gmail\.com$/.test(value)) {
            return 'El correo debe terminar en @gmail.com.';
        }
        const isUnique = await checkCorreoExistente(value);
        if (!isUnique) return 'Este correo ya está registrado.';
        return '';
    };

    // Validación del salario
    const validateSalario = (value) => {
        if (!value) return 'El salario es obligatorio.';
        if (value < 500) return 'El salario debe ser de S/ 500 o más';
        if (value > 10000) return 'El salario no puede ser mayor a S/ 10,000';
        if (value < 0) return 'El salario no puede ser negativo';
        return '';
    };


    // Verifica si un DNI ya existe en la base de datos
    const checkDniExistente = async (dni) => {
        try {
            const empleadosExistentes = await EmpleadoService.getEmpleados();
            const dniExistente = empleadosExistentes.data.some(emp => emp.dni === dni && emp.id !== empleado?.id);
            return !dniExistente;
        } catch (error) {
            console.error('Error al verificar DNI', error);
            return true;
        }
    };
    //verifica el telefono en la bd
    const checkTelefonoExistente = async (telefono) => {
        try {
            const empleadosExistentes = await EmpleadoService.getEmpleados();
            const telefonoExistente = empleadosExistentes.data.some(emp => emp.telefono === telefono && emp.id !== empleado?.id);
            return !telefonoExistente;
        } catch (error) {
            console.error('Error al verificar teléfono', error);
            return true;
        }
    };
    //verifica el correo
    const checkCorreoExistente = async (correo) => {
        try {
            const empleadosExistentes = await EmpleadoService.getEmpleados();
            const correoExistente = empleadosExistentes.data.some(emp => emp.correo === correo && emp.id !== empleado?.id);
            return !correoExistente;
        } catch (error) {
            console.error('Error al verificar correo', error);
            return true;
        }
    };

    const handleNombreChange = (e) => {
        const value = e.target.value;
        setNombre(value);
        setNombreError(validateNombre(value));
    };

    const handleTelefonoChange = async (e) => {
        const value = e.target.value;
        setTelefono(value);
        setTelefonoError(await validateTelefono(value));
    };

    const handleCorreoChange = async (e) => {
        const value = e.target.value;
        setCorreo(value);
        setCorreoError(await validateCorreo(value));
    };

    const handleSalarioChange = (e) => {
        const value = e.target.value;
        setSalario(value);
        setSalarioError(validateSalario(value));
    };

    const handleDniChange = async (e) => {
        const value = e.target.value;
        setDni(value);
        setDniError(await validateDni(value));  // Validar el DNI
    };

    const isFormValid = () => {
        return !nombreError && !telefonoError && !correoError && !salarioError && !dniError && salario && puesto && dni;
    };

    const resetFields = () => {
        setNombre('');
        setPuesto('');
        setSalario('');
        setTelefono('');
        setCorreo('');
        setDni('');
        setNombreError('');
        setTelefonoError('');
        setCorreoError('');
        setSalarioError('');
        setDniError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid()) {
            setAlertMessage('Por favor, corrige los errores en el formulario.');
            setAlertVariant('danger');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
            return;
        }

        const nuevoEmpleado = {
            id: empleado ? empleado.id : Date.now().toString(),
            nombre,
            puesto,
            salario,
            telefono,
            correo,
            dni,
        };

        if (empleado) {
            handleUpdateEmpleado(empleado.id, nuevoEmpleado);
            setAlertMessage('Empleado actualizado con éxito.');
            setAlertVariant('warning');
        } else {
            handleAddEmpleado(nuevoEmpleado);
            setAlertMessage('Empleado añadido con éxito.');
            setAlertVariant('success');
            resetFields();
        }

        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    return (
        <Container>
            <Alert show={showAlert} variant={alertVariant} dismissible onClose={() => setShowAlert(false)}>
                {alertMessage}
            </Alert>
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                centered
                backdrop="static"
                keyboard={false}
                dialogClassName="custom-modal"
            >
                <Modal.Header closeButton className={empleado ? 'modal-header-update' : ''}>
                    <Modal.Title>{empleado ? 'Editar Empleado' : 'Nuevo Empleado'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="formNombre">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nombre"
                                        value={nombre}
                                        onChange={handleNombreChange}
                                        isInvalid={!!nombreError}
                                        maxLength={15}
                                    />
                                    <Form.Control.Feedback type="invalid">{nombreError}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formPuesto">
                                    <Form.Label>Puesto</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={puesto}
                                        onChange={(e) => setPuesto(e.target.value)}
                                    >
                                        <option value="">Seleccionar puesto</option>
                                        {puestos.map((puesto, index) => (
                                            <option key={index} value={puesto}>
                                                {puesto}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="formTelefono">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Teléfono"
                                        value={telefono}
                                        onChange={handleTelefonoChange}
                                        isInvalid={!!telefonoError}
                                    />
                                    <Form.Control.Feedback type="invalid">{telefonoError}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formCorreo">
                                    <Form.Label>Correo</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Correo"
                                        value={correo}
                                        onChange={handleCorreoChange}
                                        isInvalid={!!correoError}
                                    />
                                    <Form.Control.Feedback type="invalid">{correoError}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="salario">
                                    <Form.Label>Salario</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>S/.</InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingresa el salario"
                                            value={salario}
                                            isInvalid={!!salarioError}
                                            onChange={handleSalarioChange}
                                            onInput={(e) => {
                                                // Permitir solo números
                                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                            }}
                                        />
                                    </InputGroup>
                                    {salarioError && <small className="text-danger">{salarioError}</small>}
                                </Form.Group>

                            </Col>
                            <Col>
                                <Form.Group controlId="formDni">
                                    <Form.Label>DNI</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="DNI"
                                        value={dni}
                                        onChange={handleDniChange}
                                        isInvalid={!!dniError}
                                    />
                                    <Form.Control.Feedback type="invalid">{dniError}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit" disabled={!isFormValid()}>
                                {empleado ? 'Actualizar' : 'Agregar'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default FormEmpleado;
