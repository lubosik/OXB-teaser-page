'use client'

import { useSearchParams } from 'next/navigation'

export default function Footer() {
  const searchParams = useSearchParams()
  const source = searchParams.get('source') || searchParams.get('utm_source')

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted text-center sm:text-left">
              © {new Date().getFullYear()} OXB Studio. All rights reserved.
            </p>
            {source && (
              <span className="text-xs text-muted/70 px-2 py-1 rounded bg-muted/10 border border-border">
                Referred by: {source}
              </span>
            )}
          </div>
          <p className="text-xs text-muted/70 text-center sm:text-left">
            OXB Studio is in development. Early access via Skool.
          </p>
        </div>
      </div>
    </footer>
  )
}
