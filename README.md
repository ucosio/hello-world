# Seguimiento de tareas de proyectos

Aplicación web (frontend) para gestionar tareas por carriles/estados en un tablero visual.

## Funcionalidades iniciales

- Carriles por defecto:
  - Backlog de tareas
  - En curso
  - Bloqueada
  - UAT
  - Finalizada
  - Descartada
- Posibilidad de añadir nuevos carriles a demanda.
- Creación de tareas con los campos:
  - Nombre tarea
  - Persona asignada
  - Fecha inicio
  - Fecha fin
  - Fecha bloqueo
  - Comentarios
  - Estado
  - Archivos adjuntos (se muestran nombres de archivo)

## Ejecutar localmente

Como es una app estática, puedes abrir `index.html` directamente en el navegador.

También puedes levantar un servidor local:

```bash
python3 -m http.server 8000
```

Y abrir `http://localhost:8000`.
