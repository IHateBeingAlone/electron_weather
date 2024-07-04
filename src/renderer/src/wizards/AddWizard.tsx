/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box, Button, TextField } from '@mui/material'
import { useState } from 'react'
import { ICity } from '../interfaces/data'

const formData = [
  { label: 'Название', entry: 'name' },
  { label: 'Широта', entry: 'latitude' },
  { label: 'Долгота', entry: 'longtitude' }
]

function AddWizard(): JSX.Element {
  const [data, setData] = useState<ICity>({ name: '', latitude: '', longtitude: '' })

  function updateData(entry: string, value: string): void {
    if (value.length > 0) {
      setData((prev) => {
        const copy = prev
        if (copy) {
          copy[entry] = value
        }
        return copy
      })
    }
  }

  function checkData(): boolean {
    let check = true
    if (data.name.length < 1 || data.latitude.length < 1 || data.longtitude.length < 1) {
      check = false
    }

    return check
  }

  return (
    <Box>
      {formData.map((item, key) => {
        return (
          <TextField
            key={key}
            label={item.label}
            variant="outlined"
            onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              updateData(item.entry, event.target.value)
            }}
          />
        )
      })}
      <Button
        variant="contained"
        onClick={(): void => {
          if (checkData()) {
            // @ts-ignore
            window.api.CompleteWizard({
              payload: JSON.stringify({ value: data }),
              success: true
            })
          }
        }}
      >
        Добавить город
      </Button>
    </Box>
  )
}

export default AddWizard
