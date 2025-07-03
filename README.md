# ProyectoDistribuidos
# SD_GameEngine

Este repositorio contiene un motor de juego distribuido desarrollado como parte del curso de **Sistemas Distribuidos**. El objetivo principal es implementar un sistema que permita la creación y ejecución de juegos utilizando principios de sistemas distribuidos.

## Características

- **Arquitectura distribuida**: Soporte para múltiples nodos que trabajan en conjunto.
- **Modularidad**: Componentes del motor diseñados para ser reutilizables y extensibles.
- **Soporte para gráficos y física**: Incluye funcionalidades básicas para renderizado y simulación física.
- **Comunicación en red**: Implementación de protocolos para la sincronización entre nodos.

## Requisitos

Antes de ejecutar el proyecto, asegúrate de tener instalados los siguientes requisitos:

- **Python 3.8 o superior**
- Librerías necesarias (pueden instalarse con `pip`):
  - `pygame`
  - `socket`
  - `threading`
  - Cualquier otra dependencia especificada en el archivo `requirements.txt`

## Instalación

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/tu-usuario/SD_GameEngine.git
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd SD_GameEngine
   ```

3. Instala las dependencias necesarias:

   ```bash
   pip install -r requirements.txt
   ```

## Uso

1. Ejecuta el servidor principal:

   ```bash
   python server.py
   ```

2. Ejecuta los clientes (nodos) en diferentes máquinas o en la misma máquina:

   ```bash
   python client.py
   ```

3. Sigue las instrucciones en pantalla para interactuar con el motor de juego.

## Estructura del Proyecto

- **/src**: Contiene el código fuente del motor de juego.
- **/assets**: Archivos de recursos como imágenes, sonidos, etc.
- **/docs**: Documentación adicional del proyecto.
- **requirements.txt**: Lista de dependencias necesarias.

## Contribuciones

Si deseas contribuir al proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad o corrección de errores (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m "Descripción de los cambios"`).
4. Envía un pull request.
