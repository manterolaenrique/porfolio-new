# ⚡ GUÍA RÁPIDA - 3 PASOS

## 🔴 PASO 1: GITHUB (5 min)

### 1a. Crear repositorio
- Ve a: https://github.com/new
- Nombre: `portfolio`
- Tipo: Public
- NO inicializar con README
- Click "Create repository"

### 1b. Conectar y subir
```bash
git branch -M main
git remote add origin https://github.com/TU_USUARIO/portfolio.git
git push -u origin main
```

---

## 🟡 PASO 2: SANITY (1 hora)

### 2a. Abrir Sanity Studio
```bash
npm run studio
```

### 2b. Crear documentos en este orden:
1. **Hero Section**
   - title: "Hola, soy..."
   - subtitle: "...tu subtítulo"

2. **About Section**
   - title: "Sobre mí"
   - description: "Tu descripción"

3. **Skills**
   - Create skill groups y skills dentro

4. **Projects**
   - Create mínimo 1 proyecto
   - title, description, image, tags

5. **Contact Info** ⭐ **MÁS IMPORTANTE**
   - headline: "¿Interesado en trabajar conmigo?"
   - subtitle: "..."
   - primaryEmail: tu@email.com
   - linkedinUrl: https://linkedin.com/in/tu-perfil
   - **cvPreviewImage: SUBE LA IMAGEN DEL CV** 📸
   - timezone: tu zona horaria
   - businessHoursStart: "09:00"
   - businessHoursEnd: "17:00"

### 2c. Publicar todos los documentos

---

## 🟢 PASO 3: VERCEL (10 min)

### 3a. Deploy
1. Ve a: https://vercel.com/dashboard
2. Login con GitHub
3. Click "New Project"
4. Selecciona: `portfolio`

### 3b. Variables de entorno
Agrega estas 4:

```
NEXT_PUBLIC_SANITY_PROJECT_ID = [tu_project_id]
NEXT_PUBLIC_SANITY_DATASET = production
NEXT_PUBLIC_SANITY_API_VERSION = 2024-01-01
SANITY_READ_TOKEN = [tu_token]
```

👉 **¿Dónde obtener estos?**
- Ve a: https://manage.sanity.io/projects
- En la izquierda ve tu proyecto
- Settings → API
- Verás Project ID y Dataset
- Crea un nuevo token en "Tokens"

### 3c. Desplegar
1. Click "Deploy"
2. Espera 5-10 minutos
3. ¡Listo!

---

## ✅ VERIFICAR

Después de desplegar, verifica:

- [ ] Accede a tu URL (ej: portfolio-chi.vercel.app)
- [ ] Se ve el portafolio
- [ ] Aparece contenido de Sanity
- [ ] **La imagen del CV aparece en "Recursos"**
- [ ] Funciona en móvil
- [ ] Links están activos

---

## 🎯 DOMINIO PERSONALIZADO (Opcional)

Si tienes dominio:

1. Vercel → Tu Proyecto → Settings → Domains
2. Click "Add Domain"
3. Ingresa tu dominio
4. Sigue instrucciones DNS
5. Espera 24-48 horas

---

## 📞 PROBLEMAS?

### La imagen del CV no aparece
- [ ] ¿Subiste imagen en Sanity?
- [ ] ¿Está en el campo `cvPreviewImage`?
- [ ] ¿Publicaste el documento?
- [ ] ¿Esperaste 5 min después de publicar?

### Sanity no se conecta
- [ ] ¿Variables de entorno correctas?
- [ ] ¿SANITY_READ_TOKEN es válido?

### Deploy falla
- [ ] ¿Commit en GitHub?
- [ ] ¿Variables en Vercel?
- [ ] Revisa logs en Vercel Dashboard

---

## 🚀 ¡LISTO!

En ~1.5 horas tu portafolio estará en producción. 

**Buena suerte! 🎉**

---

Documentación completa: Ver `README.md`
