import { getDecksFromBarajasForGame } from './API/barajaRepository.js';

(async () => {
  try {
    const baraja1Id = 1; // Cambia esto por el ID de la primera baraja
    const baraja2Id = 2; // Cambia esto por el ID de la segunda baraja

    const jsonString = await getDecksFromBarajasForGame(baraja1Id, baraja2Id);
    console.log('Contenido de jsonString:', jsonString);
  } catch (error) {
    console.error('Error al obtener las barajas:', error);
  }
})();