// src/context/FeedContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'

export interface FeedItem {
  id: number
  title: string
  body: string
}

interface FeedContextType {
  feed: FeedItem[]
  loading: boolean
  error: string | null
}

const FeedContext = createContext<FeedContextType>({
  feed: [],
  loading: false,
  error: null,
})

export const useFeed = () => useContext(FeedContext)

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=25')
        const data = await res.json()
        setFeed(data)
      } catch (err: any) {
        setError('Failed to fetch feed')
      } finally {
        setLoading(false)
      }
    }

    fetchFeed()
  }, [])

  return (
    <FeedContext.Provider value={{ feed, loading, error }}>
      {children}
    </FeedContext.Provider>
  )
}
