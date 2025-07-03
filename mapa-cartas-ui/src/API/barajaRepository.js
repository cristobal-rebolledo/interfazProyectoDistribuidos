// Al final del archivo, antes de module.exports, agrega estas funciones:
const db = require('./dbConnection');
/**
 * Obtiene todas las barajas
 * @returns {Promise<Array>} - Lista de barajas
 */
const getAllBarajas = async () => {
  try {
    console.log('Ejecutando getAllBarajas...');
    const result = await db.query(`
      SELECT b.*, COUNT(c."IdCarta") as cantidadCartas
      FROM "Baraja" b
      LEFT JOIN "Contiene" c ON b."IdBaraja" = c."IdBaraja"
      GROUP BY b."IdBaraja", b."IdUsuario", b."NombreBaraja", b."RutaSleeve"
      ORDER BY b."IdBaraja"
    `);
    console.log('Consulta getAllBarajas completada con éxito');
    return result.rows;
  } catch (error) {
    console.error('Error al obtener todas las barajas:', error);
    throw error;
  }
};

/**
 * Obtiene una baraja por ID con todas sus cartas
 * @param {number} idBaraja - ID de la baraja
 * @returns {Promise<Object>} - Baraja con sus cartas
 */
const getBarajaById = async (idBaraja) => {
  try {
    console.log(`Obteniendo baraja con ID: ${idBaraja}`);
    
    // Obtener información básica de la baraja
    const barajaResult = await db.query(`
      SELECT * FROM "Baraja" WHERE "IdBaraja" = $1
    `, [idBaraja]);

    if (!barajaResult.rows[0]) {
      return null;
    }

    const baraja = barajaResult.rows[0];

    // Obtener cartas de la baraja
    const cartasResult = await db.query(`
      SELECT c.*, co."VariacionImagen", i."Ruta" as imagePath
      FROM "Contiene" co
      JOIN "Carta" c ON co."IdCarta" = c."IdCarta"
      LEFT JOIN "Imagen" i ON c."IdCarta" = i."IdCarta"
      WHERE co."IdBaraja" = $1
      ORDER BY c."IdCarta"
    `, [idBaraja]);

    baraja.cartas = cartasResult.rows;
    baraja.cantidadCartas = cartasResult.rows.length;

    return baraja;
  } catch (error) {
    console.error(`Error al obtener baraja con ID ${idBaraja}:`, error);
    throw error;
  }
};

/**
 * Obtiene barajas por usuario
 * @param {number} idUsuario - ID del usuario
 * @returns {Promise<Array>} - Lista de barajas del usuario
 */
const getBarajasByUsuario = async (idUsuario) => {
  try {
    console.log(`Obteniendo barajas del usuario: ${idUsuario}`);
    const result = await db.query(`
      SELECT b.*, COUNT(c."IdCarta") as cantidadCartas
      FROM "Baraja" b
      LEFT JOIN "Contiene" c ON b."IdBaraja" = c."IdBaraja"
      WHERE b."IdUsuario" = $1
      GROUP BY b."IdBaraja", b."IdUsuario", b."NombreBaraja", b."RutaSleeve"
      ORDER BY b."IdBaraja"
    `, [idUsuario]);
    
    return result.rows;
  } catch (error) {
    console.error(`Error al obtener barajas del usuario ${idUsuario}:`, error);
    throw error;
  }
};

/**
 * Crea una nueva baraja
 * @param {Object} barajaData - Datos de la baraja
 * @returns {Promise<Object>} - Baraja creada
 */
const createBaraja = async (barajaData) => {
  try {
    console.log('Creando nueva baraja:', barajaData);
    const result = await db.query(`
      INSERT INTO "Baraja" ("IdUsuario", "NombreBaraja", "RutaSleeve")
      VALUES ($1, $2, $3)
      RETURNING *
    `, [barajaData.IdUsuario, barajaData.NombreBaraja, barajaData.RutaSleeve]);
    
    console.log('Baraja creada exitosamente');
    return result.rows[0];
  } catch (error) {
    console.error('Error al crear baraja:', error);
    throw error;
  }
};

/**
 * Actualiza una baraja existente
 * @param {number} idBaraja - ID de la baraja
 * @param {Object} barajaData - Nuevos datos de la baraja
 * @returns {Promise<Object>} - Baraja actualizada
 */
const updateBaraja = async (idBaraja, barajaData) => {
  try {
    console.log(`Actualizando baraja ${idBaraja}:`, barajaData);
    const result = await db.query(`
      UPDATE "Baraja" 
      SET "IdUsuario" = $1, "NombreBaraja" = $2, "RutaSleeve" = $3
      WHERE "IdBaraja" = $4
      RETURNING *
    `, [barajaData.IdUsuario, barajaData.NombreBaraja, barajaData.RutaSleeve, idBaraja]);
    
    if (!result.rows[0]) {
      return null;
    }
    
    console.log('Baraja actualizada exitosamente');
    return result.rows[0];
  } catch (error) {
    console.error(`Error al actualizar baraja ${idBaraja}:`, error);
    throw error;
  }
};

/**
 * Elimina una baraja
 * @param {number} idBaraja - ID de la baraja
 * @returns {Promise<boolean>} - True si se eliminó correctamente
 */
const deleteBaraja = async (idBaraja) => {
  try {
    console.log(`Eliminando baraja ${idBaraja}`);
    
    // Primero eliminar todas las cartas de la baraja
    await db.query('DELETE FROM "Contiene" WHERE "IdBaraja" = $1', [idBaraja]);
    
    // Luego eliminar la baraja
    const result = await db.query('DELETE FROM "Baraja" WHERE "IdBaraja" = $1', [idBaraja]);
    
    console.log('Baraja eliminada exitosamente');
    return result.rowCount > 0;
  } catch (error) {
    console.error(`Error al eliminar baraja ${idBaraja}:`, error);
    throw error;
  }
};

/**
 * Agrega una carta a una baraja
 * @param {number} idBaraja - ID de la baraja
 * @param {number} idCarta - ID de la carta
 * @param {string} variacionImagen - Variación de imagen (opcional)
 * @returns {Promise<Object>} - Registro creado
 */
const addCartaToBaraja = async (idBaraja, idCarta, variacionImagen = null) => {
  try {
    console.log(`Agregando carta ${idCarta} a baraja ${idBaraja}`);
    const result = await db.query(`
      INSERT INTO "Contiene" ("IdBaraja", "IdCarta", "VariacionImagen")
      VALUES ($1, $2, $3)
      RETURNING *
    `, [idBaraja, idCarta, variacionImagen]);
    
    console.log('Carta agregada a baraja exitosamente');
    return result.rows[0];
  } catch (error) {
    console.error(`Error al agregar carta ${idCarta} a baraja ${idBaraja}:`, error);
    throw error;
  }
};

/**
 * Remueve una carta de una baraja
 * @param {number} idBaraja - ID de la baraja
 * @param {number} idCarta - ID de la carta
 * @returns {Promise<boolean>} - True si se eliminó correctamente
 */
const removeCartaFromBaraja = async (idBaraja, idCarta) => {
  try {
    console.log(`Removiendo carta ${idCarta} de baraja ${idBaraja}`);
    const result = await db.query(`
      DELETE FROM "Contiene" 
      WHERE "IdBaraja" = $1 AND "IdCarta" = $2
    `, [idBaraja, idCarta]);
    
    console.log('Carta removida de baraja exitosamente');
    return result.rowCount > 0;
  } catch (error) {
    console.error(`Error al remover carta ${idCarta} de baraja ${idBaraja}:`, error);
    throw error;
  }
};

/**
 * Obtiene todas las cartas de una baraja
 * @param {number} idBaraja - ID de la baraja
 * @returns {Promise<Array>} - Lista de cartas en la baraja
 */
const getCartasInBaraja = async (idBaraja) => {
  try {
    console.log(`Obteniendo cartas de baraja ${idBaraja}`);
    const result = await db.query(`
      SELECT c.*, co."VariacionImagen", i."Ruta" as imagePath
      FROM "Contiene" co
      JOIN "Carta" c ON co."IdCarta" = c."IdCarta"
      LEFT JOIN "Imagen" i ON c."IdCarta" = i."IdCarta"
      WHERE co."IdBaraja" = $1
      ORDER BY c."IdCarta"
    `, [idBaraja]);
    
    return result.rows;
  } catch (error) {
    console.error(`Error al obtener cartas de baraja ${idBaraja}:`, error);
    throw error;
  }
};






module.exports = {
 getAllBarajas,
  getBarajaById,
  getBarajasByUsuario,
  createBaraja,
  updateBaraja,
  deleteBaraja,
  addCartaToBaraja,
  removeCartaFromBaraja,
  getCartasInBaraja,
  //checkPropietary, // POST
  // getDecksFromBarajasForGame  // websocket
};