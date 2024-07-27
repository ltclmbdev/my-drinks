'use client'

import * as React from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
// import { useLocalStorage } from '@uidotdev/usehooks'
// import { useLocalStorage } from 'react-use'
import { useLocalStorage } from '@/hooks/useLocalStorage'

import { getCocktailsByName } from '@/lib/cocktails'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CocktailsList from '@/components/cocktails-list'

export default function Home() {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const [searchResults, setSearchResults] = useLocalStorage<string[]>(
    'searchResults',
    []
  )

  const mutation = useMutation({
    mutationFn: (searchTerm: string) => getCocktailsByName(searchTerm),
    onSuccess: data => {
      console.log(data)
      if (inputRef.current) {
        queryClient.setQueryData(['cocktails', inputRef.current.value], data)
        if (searchResults && inputRef.current.value && !isEmpty(data.drinks)) {
          const newSearchValue = inputRef.current.value
          const filteredSearchResults = searchResults.filter(
            result => result !== newSearchValue
          )
          setSearchResults([newSearchValue, ...filteredSearchResults])
        }
        inputRef.current.value = ''
      }
    },
  })

  const handleSearch = () => {
    if (inputRef.current && inputRef.current.value.trim() !== '') {
      mutation.mutate(inputRef.current.value)
    }
  }

  const renderCocktails = () => {
    if (!mutation.data || !mutation.data.drinks) {
      return <p>No cocktails found.</p>
    }

    return <CocktailsList cocktails={mutation.data.drinks} />
  }

  return (
    <div className="flex flex-col items-center max-w-screen-lg w-full mx-auto pb-32">
      <h1 className="font-semibold text-3xl">Choose you cocktail 🍸</h1>
      <div className="flex items-center w-full mt-20">
        <Input
          ref={inputRef}
          placeholder="Search for cocktail"
          className="rounded-r-none grow text-xl"
          disabled={mutation.isPending}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSearch()
            }
          }}
        />
        <Button
          type="button"
          className="rounded-l-none text-3xl min-w-20"
          onClick={handleSearch}
          disabled={mutation.isPending}
        >
          🍹
        </Button>
      </div>
      {mutation.isPending && <p>Loading...</p>}
      {mutation.isError && (
        <p>
          Error: {(mutation.error as Error)?.message || 'An error occurred'}
        </p>
      )}
      {mutation.isSuccess && (
        <div className="w-full mt-20">{renderCocktails()}</div>
      )}
      {!isEmpty(searchResults) && (
        <>
          <h3 className="mt-20 text-lg font-semibold">
            Recent search results:
          </h3>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {searchResults?.map(res => {
              return (
                <Button
                  variant="outline"
                  key={res}
                  onClick={() => mutation.mutate(res)}
                >
                  {res}
                </Button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
