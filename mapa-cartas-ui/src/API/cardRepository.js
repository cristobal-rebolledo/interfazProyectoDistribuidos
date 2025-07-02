/**
 * API operations related to cards
 * This module contains all functions to interact with the cards table
 */

const db = require('./dbConnection');

/**
 * Fetches all cards from the database
 * @returns {Promise<Array>} - List of cards
 */
const getAllCards = async () => {
  try {
    console.log('Executing getAllCards...');
    // Fetch basic information of all cards
    const cardsResult = await db.query(`
      SELECT c.*, i."Ruta" as imagePath 
      FROM "Carta" c 
      LEFT JOIN "Imagen" i ON c."IdCarta" = i."IdCarta" 
      ORDER BY c."IdCarta"
    `);

    // Array to store cards with complete information
    const cards = [];

    // For each card, fetch its specific type and details
    for (const card of cardsResult.rows) {
      // Check if the card is a Spell
      const spellResult = await db.query('SELECT * FROM "Hechizo" WHERE "IdCarta" = $1', [card.IdCarta]);
      if (spellResult.rows.length > 0) {
        card.type = 'Spell';
        card.typeDetails = spellResult.rows[0];
      }

      // Check if the card is an Ally with an improved query
      const allyResult = await db.query(`
        SELECT a."IdCarta", a."Costo" as cost, a."Ataque" as attack, a."Vida" as health 
        FROM "Aliado" a 
        WHERE a."IdCarta" = $1
      `, [card.IdCarta]);
      if (allyResult.rows.length > 0) {
        card.type = 'Ally';
        card.typeDetails = allyResult.rows[0];
        // Debug to see exactly what allyResult contains
        console.log(`Ally ${card.IdCarta} details:`, allyResult.rows[0]);
      }

      // Check if the card is a Character
      const characterResult = await db.query('SELECT * FROM "Personaje" WHERE "IdCarta" = $1', [card.IdCarta]);
      if (characterResult.rows.length > 0) {
        card.type = 'Character';
        card.typeDetails = characterResult.rows[0];
      }

      // Query to fetch effects and arrows
      const effectsResult = await db.query(`
        SELECT e.*, t."Cantidad" as amount, t."Objetivo" as target, t."Duracion" as duration, t."Repetible" as repeatable, t."Trigger", t."Flechas" as arrows 
        FROM "Efecto" e
        JOIN "Tiene" t ON e."IdEfecto" = t."IdEfecto"
        WHERE t."IdCarta" = $1
      `, [card.IdCarta]);

      // Check the result
      console.log(`Effects for card ${card.IdCarta}:`, effectsResult.rows);
      // Specifically check if there are arrows
      const haveArrows = effectsResult.rows.filter(row => row.arrows);
      console.log(`Records with arrows: ${haveArrows.length}`);
      if (haveArrows.length > 0) {
        console.log('Example record with arrows:', haveArrows[0]);
      }

      // Process arrows from the previous query results
      card.arrows = effectsResult.rows
        .filter(row => row.arrows) // Filter only records that have arrows
        .map(row => ({
          targetType: row.target || 'Enemy',
          direction: row.arrows,
          cardId: card.IdCarta
        }));

      // Add effects to the card object
      card.effects = effectsResult.rows.map(row => ({
        effectId: row.IdEfecto,
        name: row.Nombre,
        description: row.Descripcion,
        isBasic: row.EsBasico,
        amount: row.amount,
        target: row.target,
        duration: row.duration,
        repeatable: row.repetible,
        trigger: row.Trigger,
        arrows: row.arrows
      }));
      // Asegurar que la imagen se incluya en el objeto card
      card.imagePath = card.imagepath || null; // PostgreSQL convierte a minúsculas
      // General debug before adding to the array
      console.log(`=== BEFORE ADDING CARD ${card.IdCarta} TO ARRAY ===`);
      console.log('Properties:', Object.keys(card));
      console.log('Has effects?:', card.effects ? `Yes (${card.effects.length})` : 'No');
      console.log('=======================================');

      // Add the complete card to the array
      cards.push(card);
    }

    console.log('getAllCards query completed successfully');
    console.log('Example card with details:', cards.length > 0 ? 
      {
        id: cards[0].IdCarta,
        type: cards[0].type,
        typeDetails: cards[0].typeDetails
      } : 'No cards');

    return cards;
  } catch (error) {
    console.error('Error fetching all cards:', error);
    throw error;
  }
};

/**
 * Fetches a card by its ID
 * @param {number} id - ID of the card to search
 * @returns {Promise<Object>} - Card data with additional information
 */
const getCardById = async (id) => {
  try {
    // Consultamos la información básica de la carta
    const cartaResult = await db.query(`
      SELECT c.*, i."Ruta" as imagenRuta 
      FROM "Carta" c
      LEFT JOIN "Imagen" i ON c."IdCarta" = i."IdCarta"
      WHERE c."IdCarta" = $1
    `, [id]);

    if (!cartaResult.rows[0]) {
      return null;
    }

    const carta = cartaResult.rows[0];
    
    // Las flechas se obtendrán de la tabla "Tiene" en la consulta de efectos

    // Consultamos el tipo de carta (Hechizo, Aliado o Personaje)
    // Consultas mejoradas para cada tipo específico de carta
    const hechizoResult = await db.query('SELECT * FROM "Hechizo" WHERE "IdCarta" = $1', [id]);
    
    // Para Aliado, vamos a asegurarnos de incluir todos los campos relevantes
    const aliadoResult = await db.query(`
      SELECT a."IdCarta", a."Costo", a."Ataque", a."Vida"
      FROM "Aliado" a
      WHERE a."IdCarta" = $1
    `, [id]);
    
    const personajeResult = await db.query(`
      SELECT p."IdCarta", p."Acciones", p."Ataque", p."Vida"
      FROM "Personaje" p
      WHERE p."IdCarta" = $1
    `, [id]);
    
    // Alrededor de la línea 138, después de la consulta de efectos, pero antes de asignar a carta.efectos:

  // Consultamos los efectos asociados a la carta (incluyendo flechas)
  const efectosResult = await db.query(`
    SELECT e.*, t.* 
    FROM "Efecto" e
    JOIN "Tiene" t ON e."IdEfecto" = t."IdEfecto"
    WHERE t."IdCarta" = $1
  `, [id]);

      // Luego comprueba el resultado
      console.log(`Efectos para carta ID ${id}:`, efectosResult.rows);
      // Verifica específicamente si hay flechas
      const tienenFlechas = efectosResult.rows.filter(row => row.Flechas);
      console.log(`Registros con flechas para carta ID ${id}: ${tienenFlechas.length}`);
      if (tienenFlechas.length > 0) {
        console.log('Ejemplo de registro con flechas para carta ID ${id}:', tienenFlechas[0]);
      }
      console.log(`Efectos para carta ID ${id}:`, efectosResult.rows);
console.log(`Registros con flechas para carta ID ${id}:`, efectosResult.rows.filter(row => row.Flechas));
    // Añadimos los efectos a la carta
    carta.efectos = efectosResult.rows;
    
    // Procesamos las flechas desde los resultados de la consulta anterior
    carta.flechas = efectosResult.rows
      .filter(row => row.Flechas) // Filtramos solo los registros que tienen flechas
      .map(row => ({
        targetType: row.Objetivo || 'Enemigo',
        direction: row.Flechas,
        cardId: id
      }));
    
    if (hechizoResult.rows.length > 0) {
      carta.tipo = 'Hechizo';
      carta.detallesTipo = hechizoResult.rows[0];
    } else if (aliadoResult.rows.length > 0) {
      carta.tipo = 'Aliado';
      carta.detallesTipo = aliadoResult.rows[0];
    } else if (personajeResult.rows.length > 0) {
      carta.tipo = 'Personaje';
      carta.detallesTipo = personajeResult.rows[0];
    }
    
    return carta;
  } catch (error) {
    console.error(`Error al obtener la carta con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene información sobre todas las cartas de un tipo específico
 * @param {string} tipo - Tipo de carta ('Hechizo', 'Aliado', 'Personaje')
 * @returns {Promise<Array>} - Lista de cartas del tipo especificado
 */
const getCardsByType = async (tipo) => {
  try {
    let query;
    switch (tipo.toLowerCase()) {
      case 'hechizo':
        query = `
          SELECT c.*, h."Costo", i."Ruta" as imagenRuta 
          FROM "Carta" c
          JOIN "Hechizo" h ON c."IdCarta" = h."IdCarta"
          LEFT JOIN "Imagen" i ON c."IdCarta" = i."IdCarta"
          ORDER BY c."IdCarta"
        `;
        break;
      case 'aliado':
        query = `
          SELECT c.*, a."Costo", a."Ataque", a."Vida", i."Ruta" as imagenRuta 
          FROM "Carta" c
          JOIN "Aliado" a ON c."IdCarta" = a."IdCarta"
          LEFT JOIN "Imagen" i ON c."IdCarta" = i."IdCarta"
          ORDER BY c."IdCarta"
        `;
        break;
      case 'personaje':
        query = `
          SELECT c.*, p."Acciones", p."Ataque", p."Vida", i."Ruta" as imagenRuta 
          FROM "Carta" c
          JOIN "Personaje" p ON c."IdCarta" = p."IdCarta"
          LEFT JOIN "Imagen" i ON c."IdCarta" = i."IdCarta"
          ORDER BY c."IdCarta"
        `;
        break;
      default:
        throw new Error('Tipo de carta no válido');
    }
    
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error(`Error al obtener cartas de tipo ${tipo}:`, error);
    throw error;
  }
};

/**
 * Obtiene todos los efectos de la base de datos
 * @returns {Promise<Array>} - Lista de efectos
 */
const getAllEfectos = async () => {
  try {
    const result = await db.query('SELECT * FROM "Efecto" ORDER BY "IdEfecto"');
    return result.rows;
  } catch (error) {
    console.error('Error al obtener todos los efectos:', error);
    throw error;
  }
};

/**
 * Obtiene las cartas que tienen un efecto específico
 * @param {number} efectoId - ID del efecto
 * @returns {Promise<Array>} - Lista de cartas con el efecto
 */
const getCartasByEfecto = async (efectoId) => {
  try {
    const result = await db.query(`
      SELECT c.*, t."Cantidad", t."Objetivo", t."Duracion", t."Repetible", t."Trigger", t."Flechas"
      FROM "Carta" c
      JOIN "Tiene" t ON c."IdCarta" = t."IdCarta"
      WHERE t."IdEfecto" = $1
      ORDER BY c."IdCarta"
    `, [efectoId]);
    return result.rows;
  } catch (error) {
    console.error(`Error al obtener cartas con efecto ${efectoId}:`, error);
    throw error;
  }
};

module.exports = {
  getAllCards,
  getCardById,
  getCardsByType,
  getAllEfectos,
  getCartasByEfecto
};
