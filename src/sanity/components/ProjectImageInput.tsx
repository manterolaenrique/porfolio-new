'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import { Button, Stack, Text } from '@sanity/ui'
import { PatchEvent, set, setIfMissing, unset, useClient, type ImageInputProps } from 'sanity'

/** Keep Sanity's crop, asset selector and preview, with an explicit upload action. */
export default function ProjectImageInput(props: ImageInputProps) {
  const client = useClient({ apiVersion: '2025-02-19' })
  const fileInput = useRef<HTMLInputElement>(null)
  const pending = useRef(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const busy = uploading || props.isUploading

  async function replaceImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file || props.readOnly || props.isUploading || pending.current) return

    setError('')
    setMessage('')
    if (!file.type.startsWith('image/')) {
      setError('Seleccioná un archivo de imagen válido.')
      return
    }

    pending.current = true
    setUploading(true)
    try {
      // Upload first: a failure must leave the current image untouched.
      const asset = await client.assets.upload('image', file, { filename: file.name })
      props.onChange(PatchEvent.from([
        setIfMissing({ _type: 'image' }),
        set({ _type: 'reference', _ref: asset._id }, ['asset']),
        unset(['crop']),
        unset(['hotspot']),
      ]))
      setMessage('Imagen actualizada en el borrador. Pulsá Publicar para mostrarla en el sitio.')
    } catch {
      setError('No se pudo subir la imagen. La imagen anterior se conserva. Revisá la conexión y tus permisos e intentá nuevamente.')
    } finally {
      pending.current = false
      setUploading(false)
    }
  }

  return (
    <Stack space={3}>
      {props.renderDefault({ ...props, readOnly: props.readOnly || busy })}
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        aria-label="Archivo de imagen principal"
        hidden
        disabled={props.readOnly || busy}
        onChange={replaceImage}
      />
      <Button
        text={uploading ? 'Subiendo imagen…' : props.value?.asset ? 'Reemplazar imagen principal' : 'Subir imagen principal'}
        mode="ghost"
        disabled={props.readOnly || busy}
        onClick={() => fileInput.current?.click()}
      />
      {error && <Text size={1} role="alert">{error}</Text>}
      <Text size={1} role="status" aria-live="polite">
        {uploading ? 'Subiendo la nueva imagen. Se conservará la anterior hasta completar la carga.' : message}
      </Text>
    </Stack>
  )
}
