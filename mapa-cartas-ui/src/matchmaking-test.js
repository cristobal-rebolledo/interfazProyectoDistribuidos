import { sendMatchmakingRequest } from './API/barajaRepository.js';

// Ejemplo de uso para unirse a un partido
async function testJoinMatch() {
  try {
    const playerId = 1; // ID del jugador que desea unirse
    
    // Enviar solicitud para unirse a un partido
    // No es necesario especificar barajaId, la función lo obtiene automáticamente
    const response = await sendMatchmakingRequest('joinMatch', playerId);
    
    // Manejar la respuesta según el estado
    if (response.status === 'success') {
      console.log('¡Te has unido a un partido exitosamente!');
      console.log('Información del partido:', response.matchInfo);
      
      // Aquí podrías redirigir al usuario a la pantalla del juego
      // o mostrar información sobre la partida que está por comenzar
    } 
    else if (response.status === 'waiting') {
      console.log('Esperando a otros jugadores...');
      console.log(response.message);
      
      // Aquí podrías mostrar una pantalla de espera
    }
    else if (response.status === 'error') {
      console.error('Error al unirse al partido:', response.message);
      
      // Mostrar mensaje de error al usuario
      if (response.message.includes('no tiene barajas')) {
        console.log('Debes crear una baraja antes de poder jugar');
        // Redirigir al usuario a la pantalla de creación de barajas
      }
    }
  } catch (error) {
    console.error('Error inesperado:', error);
  }
}

// Ejemplo de uso para abandonar un partido
async function testLeaveMatch() {
  try {
    const playerId = 1;
    const matchId = "match_123"; // ID del partido actual
    
    const response = await sendMatchmakingRequest('leaveMatch', playerId, { matchId });
    
    if (response.status === 'success') {
      console.log('Has abandonado el partido exitosamente');
      // Redirigir al usuario al menú principal
    } else {
      console.error('Error al abandonar el partido:', response.message);
    }
  } catch (error) {
    console.error('Error inesperado:', error);
  }
}

// Ejecutar el ejemplo
testJoinMatch();
