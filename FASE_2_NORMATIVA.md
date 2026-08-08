# ValuaYa - Fase 2: Módulo Normativo Oficial (SHF / Infonavit / Fovissste / INDAABIN / Catastral)

Este documento contiene las especificaciones técnicas y requisitos de información para la Fase 2 de ValuaYa, destinada a la generación de avalúos técnicos con validez oficial ante entidades financieras e instituciones públicas en México.

---

## 1. Contexto Normativo y Regulatorio en México

En México, los avalúos para créditos garantizados a la vivienda o trámites gubernamentales están regulados por:
- **Sociedad Hipotecaria Federal (SHF):** *Reglas de Carácter General que establecen la Metodología para la Valuación de Inmuebles Objeto de Créditos Garantizados a la Vivienda*.
- **INDAABIN:** *Normas Técnicas para la determinación del valor comercial de inmuebles de bienes nacionales*.
- **Infonavit / Fovissste:** Integración con Unidades de Valuación (UV) autorizadas e ingreso al sistema SELAI (XML estandarizado).
- **Catastro Municipal / Estatal:** Tablas de valores unitarios de suelo y construcción con depreciación de Ross-Heidecke.

---

## 2. Estructura del Avalúo Normativo Oficial (Fase 2)

### Sección I: Ficha de Identificación Legal y Geográfica
- **Clave Única de Vivienda (CUD)** (si aplica Infonavit).
- **Clave Catastral / Cuenta Predial** y Cuenta de Agua.
- **Georreferenciación GPS:** Coordenadas de Latitud y Longitud con mapa centrado.
- **Vigencia del Dictamen:** 6 meses exactos a partir de la fecha de inspección física.

### Sección II: Infraestructura Urbana y Servicios Públicos
- Clasificación de Zona (Habitacional Unifamiliar/Plurifamiliar, Comercial, Mixta).
- Nivel Socioeconómico (Alto, Medio, Interés Social, Popular).
- Checkbox de Servicios Públicos Disponibles:
  - [x] Agua potable y Drenaje sanitario
  - [x] Red de energía eléctrica y Alumbrado público
  - [x] Pavimentos y Banquetas
  - [x] Red de Gas natural / LP
  - [x] Transporte público y Recolección de basura
- Equipamiento Urbano (Distancia a escuelas, hospitales, parques, centros comerciales).

### Sección III: Enfoque Físico / Costo de Reemplazo Net (Ross-Heidecke)
- **Valor del Terreno:** $m^2 \text{ Terreno} \times \text{Valor Unitario Suelo}$.
- **Valor Neto de Construcción (VNC):** $\text{Costo de Reposición a Nuevo (CRN)} \times (1 - \text{Depreciación Ross-Heidecke por Edad y Conservación})$.
- **Valor Físico Total:** $\text{Valor Terreno} + \text{VNC} + \text{Obras Complementarias / Instalaciones Especiales}$.

### Sección IV: Homologación Estricta SHF (4 Factores Obligatorios)
$$\text{Valor Homologated M}^2 = \text{Precio Base M}^2 \times F_{com} \times F_{ub} \times F_{sup} \times F_{cons}$$
1. **$F_{com}$ (Factor de Comercialización):** Negociación de oferta ($0.95$ a $0.97$).
2. **$F_{ub}$ (Factor de Ubicación/Frente):** Entorno y calle ($0.90$ a $1.10$).
3. **$F_{sup}$ (Factor de Superficie):** $\left(\frac{\text{Construcción Sujeto}}{\text{Construcción Comparable}}\right)^{0.12}$.
4. **$F_{cons}$ (Factor de Conservación):** Matriz de estado físico ($1.05, 1.00, 0.90, 0.80$).

### Sección V: Anexo Fotográfico Reglamentario
- Fachada Principal y Calle / Entorno.
- Área Social (Sala / Comedor).
- Cocina y Baños.
- Recámaras.
- Patio de Servicio / Jardín / Estacionamiento.

---

## 3. Formato Electrónico y Certificación
- Exportación en formato **XML estandarizado SELAI / SHF**.
- Firma Digital de Valuador Profesional con Cédula de Valuación (CUD).
- Código QR de autenticidad y verificación en línea.
