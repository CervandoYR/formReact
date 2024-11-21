import axios from 'axios';

const API_URL = 'http://localhost:5000/empleados';

const EmpleadoService = {
    // Obtener todos los empleados
    getEmpleados: () => axios.get(API_URL),

    // Agregar empleado con ID incremental
    addEmpleado: async (empleado) => {
        try {
            const response = await axios.get(API_URL); // toma la lista actual de empleados
            const empleados = response.data;
            const maxId = empleados.length > 0 
                ? Math.max(...empleados.map(emp => parseInt(emp.id, 10))) 
                : 0;
            const newId = maxId + 1;
            const nuevoEmpleado = { ...empleado, id: newId.toString() };

            //post
            return axios.post(API_URL, nuevoEmpleado);
        } catch (error) {
            console.error('Error al agregar empleado:', error);
            throw error;
        }
    },

    // Actualizar empleado
    updateEmpleado: async (id, empleado) => {
        return axios.put(`${API_URL}/${id}`, empleado);
    },

    // Eliminar empleado
    deleteEmpleado: (id) => {
        const idString = String(id);
        return axios.delete(`${API_URL}/${idString}`);
    }
};

export default EmpleadoService;
