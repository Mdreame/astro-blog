'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

declare global {
  interface Window {
    pagefind: any
  }
}

export default function SearchDialog() {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Load pagefind and initialize search
  useEffect(() => {
    const loadPagefind = async () => {
      try {
        // Check if pagefind is already loaded
        if (window.pagefind) {
          setupSearch()
          return
        }

        // Dynamically load the pagefind script
        const script = document.createElement('script')
        script.src = '/pagefind/pagefind.js'
        script.async = true
        script.onload = async () => {
          try {
            if (window.pagefind) {
              await window.pagefind.init()
              setupSearch()
            }
          } catch (error) {
            console.error('Failed to init pagefind:', error)
          }
        }

        document.head.appendChild(script)
      } catch (error) {
        console.error('Failed to load pagefind:', error)
      }
    }

    const setupSearch = () => {
      const input = document.getElementById('pagefind_input') as HTMLInputElement
      const resultsContainer = document.getElementById('pagefind_results')

      if (!input || !resultsContainer || !window.pagefind) return

      // Set initial state
      resultsContainer.innerHTML = '<div class="p-4 text-center text-sm text-muted-foreground">开始输入搜索...</div>'

      input.addEventListener('input', async (e) => {
        const query = (e.target as HTMLInputElement).value.trim()

        if (!query) {
          resultsContainer.innerHTML = '<div class="p-4 text-center text-sm text-muted-foreground">开始输入搜索...</div>'
          return
        }

        try {
          const search = await window.pagefind.search(query)
          
          if (search.results.length === 0) {
            resultsContainer.innerHTML = '<div class="p-4 text-center text-sm text-muted-foreground">未找到结果</div>'
            return
          }

          const resultsData = await Promise.all(
            search.results.map(async (result: any) => {
              const data = await result.data()
              return {
                id: result.id,
                title: data.title,
                url: data.url,
                excerpt: data.excerpt || data.content?.substring(0, 150) || '',
              }
            }),
          )

          resultsContainer.innerHTML = resultsData
            .map(
              (result: any, index: number) => `
                <a href="${result.url}" class="block px-4 py-3 hover:bg-muted/60 ${index !== resultsData.length - 1 ? 'border-b' : ''} transition-colors text-sm">
                  <div class="font-semibold text-foreground truncate">${result.title}</div>
                  <div class="text-xs text-muted-foreground line-clamp-2 mt-1">${result.excerpt}</div>
                </a>
              `,
            )
            .join('')
          
          // Add click handlers to close dialog
          Array.from(resultsContainer.querySelectorAll('a')).forEach((link) => {
            link.addEventListener('click', () => {
              setOpen(false)
            })
          })
        } catch (error) {
          console.error('Search error:', error)
          resultsContainer.innerHTML = '<div class="p-4 text-center text-sm text-red-500">搜索错误</div>'
        }
      })
    }

    if (typeof window !== 'undefined') {
      loadPagefind()
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to toggle search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      // ESC to close
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // Focus input and reset when dialog opens
  useEffect(() => {
    if (open) {
      // Use a small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        const input = document.getElementById('pagefind_input') as HTMLInputElement
        const resultsContainer = document.getElementById('pagefind_results')
        
        if (input) {
          input.value = ''
          input.focus()
        }
        
        if (resultsContainer) {
          resultsContainer.innerHTML = '<div class="p-4 text-center text-sm text-muted-foreground">开始输入搜索...</div>'
        }
      }, 50)
      
      return () => clearTimeout(timer)
    }
  }, [open])

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
  }

  return (
    <>
      {/* Search button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleOpenChange(true)}
        className="w-9 h-9"
        title="Search (⌘K)"
      >
        <Search className="size-4" />
      </Button>

      {/* Search dialog */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
          onClick={() => handleOpenChange(false)}
        />
      )}

      {/* Dialog content */}
      <div
        ref={dialogRef}
        data-open={open}
        className="fixed top-0 left-0 right-0 z-50 flex items-start justify-center transition-all duration-200 pointer-events-none"
        style={{
          paddingTop: open ? '20vh' : '0',
          opacity: open ? 1 : 0,
        }}
      >
        <div
          className={`pointer-events-auto w-full max-w-2xl mx-4 rounded-lg border border-border bg-background shadow-lg overflow-hidden transition-all duration-200 ${
            open ? 'scale-100' : 'scale-95'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search className="size-5 text-muted-foreground flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="搜索文章..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              id="pagefind_input"
            />
            <button
              onClick={() => handleOpenChange(false)}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Results container */}
          <div
            className="max-h-[calc(100vh-300px)] overflow-y-auto"
            id="pagefind_results"
          />

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-0.5 rounded bg-background border border-border">⌘K</kbd>
                打开
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-0.5 rounded bg-background border border-border">ESC</kbd>
                关闭
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Load pagefind UI styles */}
      <link
        rel="stylesheet"
        href="/pagefind/pagefind-ui.css"
      />
    </>
  )
}
