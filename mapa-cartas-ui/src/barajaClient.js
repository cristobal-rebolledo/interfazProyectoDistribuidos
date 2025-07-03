/**
 * Cliente API para barajas
 * Este módulo contiene todas las funciones para comunicarse con la API de barajas
 */

const API_BASE_URL = 'http://localhost:3030/api';

/**
 * Maneja las respuestas HTTP y los errores
 * @param {Response} response - La respuesta de fetch
 * @returns {Promise} - Datos procesados o error
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Error desconocido en el servidor'
    }));
    
    throw new Error(errorData.message || `Error HTTP: ${response.status}`);
  }
  
  return response.json();
};

/**
 * Obtiene todas las barajas
 * @returns {Promise<Array>} - Lista de barajas
 */
const getBarajas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/barajas`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error al obtener las barajas:', error);
    throw error;
  }
};

/**
 * Obtiene una baraja por su ID
 * @param {number} id - ID de la baraja a obtener
 * @returns {Promise<Object>} - Datos de la baraja
 */
const getBarajaById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/barajas/${id}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error al obtener la baraja con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene barajas por usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Array>} - Lista de barajas del usuario
 */
const getBarajasByUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/${userId}/barajas`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error al obtener barajas del usuario ${userId}:`, error);
    throw error;
  }
};

/**
 * Crea una nueva baraja
 * @param {Object} barajaData - Datos de la baraja a crear
 * @param {string} barajaData.name - Nombre de la baraja
 * @param {number} barajaData.userId - ID del usuario propietario
 * @param {string} [barajaData.sleevePath] - Ruta del sleeve (opcional)
 * @returns {Promise<Object>} - Baraja creada
 */
const createBaraja = async (barajaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/barajas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(barajaData)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error al crear baraja:', error);
    throw error;
  }
};

/**
 * Actualiza una baraja existente
 * @param {number} id - ID de la baraja a actualizar
 * @param {Object} barajaData - Nuevos datos de la baraja
 * @param {string} [barajaData.name] - Nombre de la baraja
 * @param {number} [barajaData.userId] - ID del usuario propietario
 * @param {string} [barajaData.sleevePath] - Ruta del sleeve
 * @returns {Promise<Object>} - Baraja actualizada
 */
const updateBaraja = async (id, barajaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/barajas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(barajaData)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error(`Error al actualizar la baraja con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina una baraja
 * @param {number} id - ID de la baraja a eliminar
 * @returns {Promise<Object>} - Respuesta de confirmación
 */
const deleteBaraja = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/barajas/${id}`, {
      method: 'DELETE'
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error(`Error al eliminar la baraja con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Agrega una carta a una baraja
 * @param {number} barajaId - ID de la baraja
 * @param {number} cartaId - ID de la carta
 * @param {string} variacionImagen - Variación de imagen (opcional)
 * @returns {Promise<Object>} - Respuesta de confirmación
 */
const addCartaToBaraja = async (barajaId, cartaId, variacionImagen = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/barajas/${barajaId}/cartas/${cartaId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ variacionImagen })
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error(`Error al agregar carta ${cartaId} a baraja ${barajaId}:`, error);
    throw error;
  }
};

/**
 * Remueve una carta de una baraja
 * @param {number} barajaId - ID de la baraja
 * @param {number} cartaId - ID de la carta
 * @returns {Promise<Object>} - Respuesta de confirmación
 */
const removeCartaFromBaraja = async (barajaId, cartaId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/barajas/${barajaId}/cartas/${cartaId}`, {
      method: 'DELETE'
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error(`Error al remover carta ${cartaId} de baraja ${barajaId}:`, error);
    throw error;
  }
};

/**
 * Obtiene cartas de una baraja
 * @param {number} barajaId - ID de la baraja
 * @returns {Promise<Array>} - Lista de cartas en la baraja
 */
const getCartasFromBaraja = async (barajaId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/barajas/${barajaId}/cartas`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error al obtener cartas de baraja ${barajaId}:`, error);
    throw error;
  }
};

// Opción 1: Exportar como módulo Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getBarajas,
    getBarajaById,
    getBarajasByUser,
    createBaraja,
    updateBaraja,
    deleteBaraja,
    addCartaToBaraja,
    removeCartaFromBaraja,
    getCartasFromBaraja
  };
}

// Opción 2: Cliente para navegador - Clase BarajaManager
if (typeof window !== 'undefined') {
  /**
   * Clase para manejar barajas con eventos y estado
   */
  class BarajaManager extends EventTarget {
    constructor() {
      super();
      this.barajas = [];
      this.currentBaraja = null;
      this.currentCartasBaraja = [];
    }

    /**
     * Emite un evento personalizado
     * @param {string} eventName - Nombre del evento
     * @param {any} data - Datos del evento
     */
    emit(eventName, data) {
      this.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    }

    /**
     * Carga todas las barajas
     */
    async loadBarajas() {
      try {
        this.barajas = await getBarajas();
        this.emit('barajasLoaded', this.barajas);
        return this.barajas;
      } catch (error) {
        this.emit('error', { message: 'Error al cargar barajas', error });
        throw error;
      }
    }

    /**
     * Carga barajas de un usuario específico
     * @param {number} userId - ID del usuario
     */
    async loadBarajasByUser(userId) {
      try {
        this.barajas = await getBarajasByUser(userId);
        this.emit('barajasLoaded', this.barajas);
        return this.barajas;
      } catch (error) {
        this.emit('error', { message: 'Error al cargar barajas del usuario', error });
        throw error;
      }
    }

    /**
     * Selecciona una baraja y carga sus cartas
     * @param {number} barajaId - ID de la baraja
     */
    async selectBaraja(barajaId) {
      try {
        this.currentBaraja = await getBarajaById(barajaId);
        this.currentCartasBaraja = await getCartasFromBaraja(barajaId);
        
        this.emit('barajaSelected', {
          baraja: this.currentBaraja,
          cartas: this.currentCartasBaraja
        });
        
        return {
          baraja: this.currentBaraja,
          cartas: this.currentCartasBaraja
        };
      } catch (error) {
        this.emit('error', { message: 'Error al seleccionar baraja', error });
        throw error;
      }
    }

    /**
     * Crea una nueva baraja
     * @param {Object} barajaData - Datos de la baraja
     */
    async createBaraja(barajaData) {
      try {
        const newBaraja = await createBaraja(barajaData);
        this.barajas.push(newBaraja);
        this.emit('barajaCreated', newBaraja);
        this.emit('barajasUpdated', this.barajas);
        return newBaraja;
      } catch (error) {
        this.emit('error', { message: 'Error al crear baraja', error });
        throw error;
      }
    }

    /**
     * Actualiza una baraja existente
     * @param {number} id - ID de la baraja
     * @param {Object} barajaData - Nuevos datos
     */
    async updateBaraja(id, barajaData) {
      try {
        const updatedBaraja = await updateBaraja(id, barajaData);
        
        // Actualizar en la lista local
        const index = this.barajas.findIndex(b => b.id === id);
        if (index !== -1) {
          this.barajas[index] = updatedBaraja;
        }
        
        // Si es la baraja actual, actualizarla
        if (this.currentBaraja && this.currentBaraja.id === id) {
          this.currentBaraja = updatedBaraja;
        }
        
        this.emit('barajaUpdated', updatedBaraja);
        this.emit('barajasUpdated', this.barajas);
        return updatedBaraja;
      } catch (error) {
        this.emit('error', { message: 'Error al actualizar baraja', error });
        throw error;
      }
    }

    /**
     * Elimina una baraja
     * @param {number} id - ID de la baraja
     */
    async deleteBaraja(id) {
      try {
        await deleteBaraja(id);
        
        // Remover de la lista local
        this.barajas = this.barajas.filter(b => b.id !== id);
        
        // Si era la baraja actual, limpiarla
        if (this.currentBaraja && this.currentBaraja.id === id) {
          this.currentBaraja = null;
          this.currentCartasBaraja = [];
        }
        
        this.emit('barajaDeleted', { id });
        this.emit('barajasUpdated', this.barajas);
        return { success: true };
      } catch (error) {
        this.emit('error', { message: 'Error al eliminar baraja', error });
        throw error;
      }
    }

    /**
     * Agrega una carta a la baraja actual
     * @param {number} cartaId - ID de la carta
     * @param {string} variacionImagen - Variación de imagen
     */
    async addCartaToCurrentBaraja(cartaId, variacionImagen = null) {
      if (!this.currentBaraja) {
        throw new Error('No hay baraja seleccionada');
      }

      try {
        await addCartaToBaraja(this.currentBaraja.id, cartaId, variacionImagen);
        
        // Recargar cartas de la baraja
        this.currentCartasBaraja = await getCartasFromBaraja(this.currentBaraja.id);
        
        this.emit('cartaAddedToBaraja', {
          barajaId: this.currentBaraja.id,
          cartaId,
          cartas: this.currentCartasBaraja
        });
        
        return this.currentCartasBaraja;
      } catch (error) {
        this.emit('error', { message: 'Error al agregar carta a baraja', error });
        throw error;
      }
    }

    /**
     * Remueve una carta de la baraja actual
     * @param {number} cartaId - ID de la carta
     */
    async removeCartaFromCurrentBaraja(cartaId) {
      if (!this.currentBaraja) {
        throw new Error('No hay baraja seleccionada');
      }

      try {
        await removeCartaFromBaraja(this.currentBaraja.id, cartaId);
        
        // Actualizar lista local
        this.currentCartasBaraja = this.currentCartasBaraja.filter(c => c.id !== cartaId);
        
        this.emit('cartaRemovedFromBaraja', {
          barajaId: this.currentBaraja.id,
          cartaId,
          cartas: this.currentCartasBaraja
        });
        
        return this.currentCartasBaraja;
      } catch (error) {
        this.emit('error', { message: 'Error al remover carta de baraja', error });
        throw error;
      }
    }

    /**
     * Obtiene las barajas actuales
     */
    getBarajas() {
      return this.barajas;
    }

    /**
     * Obtiene la baraja actualmente seleccionada
     */
    getCurrentBaraja() {
      return this.currentBaraja;
    }

    /**
     * Obtiene las cartas de la baraja actual
     */
    getCurrentCartasBaraja() {
      return this.currentCartasBaraja;
    }
  }

  // Hacer BarajaManager disponible globalmente
  window.BarajaManager = BarajaManager;

  // También hacer las funciones disponibles globalmente para uso directo
  window.BarajaAPI = {
    getBarajas,
    getBarajaById,
    getBarajasByUser,
    createBaraja,
    updateBaraja,
    deleteBaraja,
    addCartaToBaraja,
    removeCartaFromBaraja,
    getCartasFromBaraja
  };
}