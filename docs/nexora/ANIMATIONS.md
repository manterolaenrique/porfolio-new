# Nexora: especificacion de movimiento para revision visual

Implementadas en DEV en `src/components/nexora/Motion.tsx`, `Mockup.tsx` y los estilos locales de Nexora. La referencia de Etapa 1A se conserva con los siguientes comportamientos efectivos.

| Efecto | Objetivo | Especificacion | Fallback |
| --- | --- | --- | --- |
| Scroll Reveal | Secciones y listas | HTML inicialmente visible; opacidad .65 a 1, Y 16 a 0; 450 ms; una vez por entrada inicial | Contenido visible, sin desplazamiento |
| Hero escalonado | Marca, titulo, texto, CTA, recurso | Secuencia de 80 ms, entrada de 450 ms; sin parallax | Orden DOM conservado, visible desde inicio |
| Tarjetas 3D | Servicios y proyectos | Inclinacion maxima 5 grados; perspectiva 1000 px; reset 200 ms al salir | Tarjeta neutral en touch/teclado/reduced motion |
| Mockups desktop/mobile | Inicio y detalle | Selector de dispositivos con nombres accesibles, fundido 180 ms y marco estable | Selector funciona sin animacion; no inventar captura mobile |
| Glow con cursor | Tarjetas/recurso activo | Halo recortado al contenedor, sin cursor artificial ni seguimiento global; update por frame | Borde estatico con foco visible |

No sustituir por animacion de menu, hover basico, parallax ni linea de tiempo.
No dejar contenido inaccesible si falla JavaScript. El recurso del hero debe ser
un producto real o una representacion claramente identificada, sin metricas falsas.
