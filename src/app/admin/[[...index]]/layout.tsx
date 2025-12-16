export { metadata, viewport } from 'next-sanity/studio'

import React from 'react'

type Props = {
	children: React.ReactNode
}

// Next expects a default export that is a React component for the route layout.
export default function AdminLayout({ children }: Props) {
	return <>{children}</>
}
